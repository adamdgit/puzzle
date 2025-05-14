import { motion, useAnimation } from 'motion/react'
import { move_is_valid } from "../utils/moveIsValid";

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

    function check_win_condition(): boolean {      
        // if we make it through the array without returning false,
        // then all index are in correct order and puzzle must be solved
        for (const [idx, tile] of boardTiles.entries()) {
            if (tile.idx !== idx) return false
        };

        return true;
    }

    function handle_check_move(e: React.MouseEvent<HTMLImageElement>) {
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
        if (!direction) {
            // setError("Invalid move!");
            return
        }

        if (!blank_tile) return
        
        let translateTo, translateFrom = '';
        if (direction === 'left') {
            translateTo = `translateX(-100%)`;
            translateFrom = `translateX(0%)`;
        }
        else if (direction === 'right') {
            translateTo = `translateX(100%)`;
            translateFrom = `translateX(0%)`;
        }
        else if (direction === 'up') {
            translateTo = `translateY(-100%)`;
            translateFrom = `translateY(0%)`;
        }
        else if (direction === 'down') {
            translateTo = `translateY(100%)`;
            translateFrom = `translateY(0%)`;
        };

        controls.start({
            transform: translateTo,
            transition: { duration: 0.040 },
        }).then(() => {
            controls.set({ transform: translateFrom });

            setBoardTiles(prev => {
                const updated = [...prev];
                [updated[target_idx], updated[blank_Idx]] = [updated[blank_Idx], updated[target_idx]];
                return updated;
            });

            const is_winner = check_win_condition();
            if (is_winner) console.log("WINNER!")
        });
    }

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
                onClick={handle_check_move}
            />
        )
    }
}
