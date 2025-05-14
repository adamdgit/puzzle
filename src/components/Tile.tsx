import { motion, useAnimation } from 'motion/react'
import { move_is_valid } from "../utils/moveIsValid";
import { useEffect } from 'react';

type TileProps = {
    imgSrc: string,
    idx: number
}

export default function Tile({ tile, boardTiles, setBoardTiles, rows, cols } : {
    tile: TileProps,
    boardTiles: TileProps[],
    setBoardTiles: React.Dispatch<React.SetStateAction<TileProps[]>>,
    rows: number,
    cols: number
}) {
    const controls = useAnimation();

    function isWinner(): boolean {      
        // if we make it through the array without returning false,
        // then all index are in correct order and puzzle must be solved
        for (const [idx, tile] of boardTiles.entries()) {
            if (tile.idx !== idx) return false
        };

        return true;
    }

    function handleMoveTile(e: React.MouseEvent<HTMLImageElement>) {
        // for a move to be valid the clicked tile must be adjacent to the blank
        const target_tile = e.target as HTMLElement;

        if (!target_tile) return

        const target_idx = boardTiles.findIndex(tile => tile.idx === Number(target_tile.dataset.idx));
        const blank_Idx = boardTiles.findIndex(tile => tile.idx === (rows * cols - 1));
        const blank_tile =  boardTiles.find(tile => tile.idx === (rows * cols - 1));

        // if true the selected move is valid and can be swapped with the blank tile
        // returns up, down, left, right or null
        const direction = move_is_valid(target_idx, blank_Idx, cols); 

        // move is not valid, show user some visual feedback
        if (!direction || !blank_tile) {
            // setError("Invalid move!");
            return
        }
        
        const translateMap = {
            "left": { to: `translateX(-100%)`, reset: `translateX(0%)` },
            "right": { to: `translateX(100%)`, reset: `translateX(0%)` },
            "up": { to: `translateY(-100%)`, reset: `translateY(0%)` },
            "down": { to: `translateY(100%)`, reset: `translateY(0%)` },
        };
        const translateTo = translateMap[direction].to;
        const translateReset = translateMap[direction].reset;

        controls.start({
            transform: translateTo,
            transition: { duration: 0.040 },
        }).then(() => {
            controls.set({ transform: translateReset });

            setBoardTiles(prev => {
                const updated = [...prev];
                [updated[target_idx], updated[blank_Idx]] = [updated[blank_Idx], updated[target_idx]];
                return updated;
            });
        });
    }

    // Check for win condition every time the boardtiles updates
    useEffect(() => {
        if (!boardTiles) return

        if (isWinner()) {
            console.log("You WIN!");
            // handle win logic
        }
    },[boardTiles])

    if (tile.imgSrc === "blank") {
        return (
            <motion.div key={tile.idx} data-idx={tile.idx} animate={controls} />
        )
    } else {
        return (
            <motion.img
                key={tile.idx}
                src={tile.imgSrc}
                data-idx={tile.idx}
                animate={controls}
                onClick={handleMoveTile}
                draggable={false}
            />
        )
    }
}
