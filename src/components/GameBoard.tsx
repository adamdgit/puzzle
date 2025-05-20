import { useRef, useEffect, useState } from "react";
import Tile from "./Tile";

type TileProps = {
    imgSrc: string,
    idx: number
}

export default function GameBoard({ gameImage, BOARDSIZE, ROWS, COLUMNS, setGameEnded } : {
    gameImage: HTMLCanvasElement,
    BOARDSIZE: number,
    ROWS: number,
    COLUMNS: number, 
    setGameEnded: React.Dispatch<React.SetStateAction<boolean>>
}) {
    const board = useRef<HTMLDivElement | null>(null);
    const canvas = useRef<HTMLCanvasElement | null>(null);
    const [boardTiles, setBoardTiles] = useState<TileProps[]>([]);

    function createTileFromImg() {
        const ctx = canvas?.current?.getContext('2d');

        if (!canvas.current || !ctx) {
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
                    ctx.drawImage(gameImage, x, y, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight)
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

        // do 1500 valid moves randomly to shuffle the board
        for (let i=0; i < 5; i++) {
            // empty valid moves each loop to find new valid moves
            const validMoves = [];

            // swap random tile with blank tile
            [shuffled_tiles[blank], shuffled_tiles[randomIndex]] = 
            [shuffled_tiles[randomIndex], shuffled_tiles[blank]];
            blank = shuffled_tiles.indexOf(shuffled_tiles[randomIndex]); // keep track of blank tile
            validCol = blank % COLUMNS;
            validRow = Math.floor(blank / ROWS);
            
            // find each possible valid move based on blank tile index
            const a = blank +1;
            const b = blank -1;
            const c = blank +ROWS;
            const d = blank -ROWS;

            // check if move is valid, insert into validMove array
            if ((a <= shuffled_tiles.length-1) && (Math.floor(a / ROWS) === validRow)) 
                { validMoves.push(a) }
            if ((b >= 0) && (Math.floor(b / ROWS) === validRow)) 
                { validMoves.push(b) }
            if ((c <= shuffled_tiles.length-1) && (c % COLUMNS === validCol)) 
                { validMoves.push(c) }
            if ((d >= 0) && (d % COLUMNS === validCol)) 
                { validMoves.push(d) }

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
                    rows={ROWS} 
                    cols={COLUMNS} 
                    setGameEnded={setGameEnded}
                />
            )}
        </div>
    </>
  )
}
