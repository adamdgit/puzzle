import { useRef, useEffect, useState } from "react";
import Tile from "./Tile";
import { useAppContext } from "../context/AppContext";

type TileProps = {
    imgSrc: string,
    idx: number
}

export default function GameBoard() {
    const context = useAppContext();
    const { 
        croppedImage, 
        BOARDSIZE, ROWS, COLUMNS
     } = context;

    const board = useRef<HTMLDivElement | null>(null);
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const [boardTiles, setBoardTiles] = useState<TileProps[]>([]);

    function createTileFromImg() {
        const ctx = canvas?.current?.getContext('2d');

        if (!canvas.current || !ctx || !croppedImage) {
            // setError("Error creating board from image")
            return
        }

        // receives an image to split into tiles
        canvas.current.width = BOARDSIZE / ROWS;
        canvas.current.height = BOARDSIZE / COLUMNS;

        const tile_elements = [] as TileProps[];
        let counter = -1;

        // split image into base 64 urls and save to array
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                counter ++;
                let tileSrc = ''; // save canvas tile each iteration
                const tileWidth = BOARDSIZE / ROWS;
                const tileHeight = BOARDSIZE / COLUMNS;

                // x & y co-ordinates of each tiles corner to start drawing from
                const x = tileWidth * j;
                const y = tileHeight * i;

                // last iteration is always a blank tile for game to work correctly
                if (counter === ROWS * COLUMNS -1) {
                    tile_elements.push({ imgSrc: "blank", idx: counter})
                } else {
                    // draw tile to canvas
                    ctx.drawImage(croppedImage, x, y, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight)
                    ctx.rect(x, y, tileWidth, tileHeight)
                    ctx.strokeStyle = 'black'
                    ctx.stroke()

                    // add base 64 URL to tiles array for each tile
                    tileSrc = canvas.current.toDataURL();

                    // push all the images as strings, will append to the DOM later
                    tile_elements.push({ imgSrc: tileSrc, idx: counter})
                }
            }
        }

        return tile_elements;
    };

    function shuffleBoard(unshuffled_tiles: TileProps[]) {
        // represents the tiles index, after shuffling we can simply 
        // move the tiles in the DOM to start the game
        const shuffled_tiles = Array.from({ length: ROWS * COLUMNS }, (_, i) => i);

        let blank = ROWS * COLUMNS -1; // starting blank index

        let validCol = blank % COLUMNS
        let validRow = Math.floor(blank / ROWS)
        let randomIndex = blank; // first move will always be the blank tile

        // We *must* select valid random moves only
        // the board can become unsolvable if we simply shuffle all tiles
        for (let i=0; i < 1500; i++) {
            // reset valid moves each iteration
            const validMoves = [];

            // swap random tile with blank tile
            [shuffled_tiles[blank], shuffled_tiles[randomIndex]] = 
            [shuffled_tiles[randomIndex], shuffled_tiles[blank]];
            blank = shuffled_tiles.indexOf(shuffled_tiles[randomIndex]); // keep track of blank tile
            validCol = blank % COLUMNS;
            validRow = Math.floor(blank / ROWS);
            
            // find each possible valid move based on blank tile index
            const right = blank +1;
            const left = blank -1;
            const down = blank +ROWS;
            const up = blank -ROWS;

            // Add valid moves only, so we can select a random move each iteration
            if ((right <= shuffled_tiles.length-1) && (Math.floor(right / ROWS) === validRow)) {
                validMoves.push(right)
            }
            if ((left >= 0) && (Math.floor(left / ROWS) === validRow)) {
                validMoves.push(left) 
            }
            if ((down <= shuffled_tiles.length-1) && (down % COLUMNS === validCol)) {
                validMoves.push(down)
            }
            if ((up >= 0) && (up % COLUMNS === validCol)) {
                validMoves.push(up) 
            }

            // select a random move from all valid moves
            randomIndex = validMoves[Math.floor(Math.random() * validMoves.length)];
        }

        if (!board.current) {
            // setError("No board found");
            return
        }

        // update board tiles according to shuffled indexes
        const newBoardTiles = [] as TileProps[];
        shuffled_tiles.map(tileIdx => {
            const tile = unshuffled_tiles.find(tile => tile.idx === tileIdx);
            if (!tile) return
            newBoardTiles.push({ imgSrc: tile.imgSrc, idx: tile.idx });
        });

        setBoardTiles(newBoardTiles);
    }

    useEffect(() => {
        if (!board.current) return;

        const unshuffled_tiles = createTileFromImg();
        shuffleBoard(unshuffled_tiles!);
    },[board.current]);

  return (
    <>
        <canvas ref={canvas} style={{display: "none"}}></canvas>
        <div className='board' ref={board} draggable={false}>
            {boardTiles.map(tile => 
                <Tile 
                    key={tile.idx}
                    tile={tile} 
                    boardTiles={boardTiles} 
                    setBoardTiles={setBoardTiles} 
                />
            )}
        </div>
    </>
  )
}
