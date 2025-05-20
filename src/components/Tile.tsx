import { motion, useAnimation } from 'motion/react'
import { move_is_valid } from "../utils/moveIsValid";

type TileProps = {
    imgSrc: string,
    idx: number
}

export default function Tile({ tile, boardTiles, setBoardTiles, rows, cols, setGameEnded } : {
    tile: TileProps,
    boardTiles: TileProps[],
    setBoardTiles: React.Dispatch<React.SetStateAction<TileProps[]>>,
    rows: number,
    cols: number,
    setGameEnded: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const controls = useAnimation();

    function isWinner(updatedTiles: TileProps[]): boolean {      
        // if we make it through the array without returning false,
        // then all index are in correct order and puzzle must be solved
        for (const [idx, tile] of updatedTiles.entries()) {
            if (tile.idx !== idx) return false
        };

        return true;
    }

    function handleMoveTile(e: React.MouseEvent<HTMLImageElement>) {
        const target_tile = e.target as HTMLElement;

        if (!target_tile) return

        const target_idx = boardTiles.findIndex(tile => tile.idx === Number(target_tile.dataset.idx));
        const blank_Idx = boardTiles.findIndex(tile => tile.idx === (rows * cols - 1));
        const blank_tile =  boardTiles.find(tile => tile.idx === (rows * cols - 1));

        // returns direction of the blank tile, so we can animate the tile correctly
        const direction = move_is_valid(target_idx, blank_Idx, cols); 

        // direction can be null (invalid move), show user some visual feedback
        if (!direction || !blank_tile) {
            // setError("Invalid move!");
            return
        }
        
        const translateMap = {
            "left":  { to: `translateX(-100%)`, reset: `translateX(0%)` },
            "right": { to: `translateX(100%)`, reset: `translateX(0%)` },
            "up":    { to: `translateY(-100%)`, reset: `translateY(0%)` },
            "down":  { to: `translateY(100%)`, reset: `translateY(0%)` },
        };
        const translateTo = translateMap[direction].to;
        const translateReset = translateMap[direction].reset;

        controls.start({
            transform: translateTo,
            transition: { duration: 0.040 },
        }).then(() => {
            controls.set({ transform: translateReset });

            const updatedTiles = [...boardTiles];
            [updatedTiles[target_idx], updatedTiles[blank_Idx]] = [updatedTiles[blank_Idx], updatedTiles[target_idx]];

            if (isWinner(updatedTiles)) {
                console.log("You WIN!");
                // Game is over
                setGameEnded(true);
            }

            setBoardTiles(updatedTiles);
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
                onClick={handleMoveTile}
                draggable={false}
            />
        )
    }
}
