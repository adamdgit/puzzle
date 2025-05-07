import { useState, useRef, useEffect } from "react";
import { ASSERT } from "../utils/assert";

export default function GameBoard({ gameImage } : {
    gameImage: HTMLCanvasElement
}) {
    const [ROWS] = useState(3);
    const [COLUMNS] = useState(3);
    const [BOARDSIZE] = useState(450); // pixels for board height/width

    const board = useRef<HTMLDivElement | null>(null);
    const canvas = useRef<HTMLCanvasElement | null>(null);

    function create_tiles_from_img() {
        const ctx = canvas?.current?.getContext('2d');

        if (!canvas.current || !ctx) {
            // setError("Error creating board from image")
            return
        }

        // receives an image to split into tiles
        canvas.current.width = BOARDSIZE / ROWS;
        canvas.current.height = BOARDSIZE / COLUMNS;

        const tile_elements = [];

        // split image into base 64 urls and save to array
        for (let i = 0; i < ROWS; i++) {
            for (let j = 0; j < COLUMNS; j++) {
                let tileSrc = ''; // save canvas tile each iteration
                const tileWidth = BOARDSIZE / ROWS;
                const tileHeight = BOARDSIZE / COLUMNS;

                // x & y co-ordinates of each tiles corner to start drawing from
                const x = tileWidth * j;
                const y = tileHeight * i;

                // bottom-right corner tile must be blank for game to work
                if (x === (tileWidth * (ROWS-1)) && y === (tileHeight * (COLUMNS-1))) {
                    tile_elements.push("blank")
                } else {
                    // draw tile to canvas
                    ctx.drawImage(gameImage, x, y, tileWidth, tileHeight, 0, 0, tileWidth, tileHeight)
                    ctx.rect(x, y, tileWidth, tileHeight)
                    ctx.strokeStyle = 'black'
                    ctx.stroke()

                    // add base 64 URL to tiles array for each tile
                    tileSrc = canvas.current.toDataURL();

                    // push all the images as strings, will append to the DOM later
                    tile_elements.push(tileSrc)
                }
            }
        }

        return tile_elements;
    };

    function shuffle_board_tiles(tile_elements: string[] | undefined) {
        ASSERT(tile_elements); // tiles should never be null

        // represents the tiles index, after shuffling we can simply 
        // move the tiles in the DOM to start the game
        const shuffled_tiles_loc = [0,1,2,3,4,5,6,7,8];
        let blank = 8;

        let validCol = blank % COLUMNS
        let validRow = Math.floor(blank / ROWS)
        let randomIndex = blank; // first move will always be the blank tile

        // do 1500 valid moves randomly to shuffle the board
        for (let i=0; i<1500; i++) {
            // empty valid moves each loop to find new valid moves
            const validMoves = [];

            // swap random tile with blank tile
            [shuffled_tiles_loc[blank], shuffled_tiles_loc[randomIndex]] = 
            [shuffled_tiles_loc[randomIndex], shuffled_tiles_loc[blank]]
            blank = shuffled_tiles_loc.indexOf(shuffled_tiles_loc[randomIndex]) // keep track of blank tile
            validCol = blank % COLUMNS
            validRow = Math.floor(blank / ROWS)
            
            // find each possible valid move based on blank tile index
            const a = blank +1;
            const b = blank -1;
            const c = blank +ROWS;
            const d = blank -ROWS;

            // check if move is valid, insert into validMove array
            if ((a <= shuffled_tiles_loc.length-1) && (Math.floor(a / ROWS) === validRow)) 
                { validMoves.push(a) }
            if ((b >= 0) && (Math.floor(b / ROWS) === validRow)) 
                { validMoves.push(b) }
            if ((c <= shuffled_tiles_loc.length-1) && (c % COLUMNS === validCol)) 
                { validMoves.push(c) }
            if ((d >= 0) && (d % COLUMNS === validCol)) 
                { validMoves.push(d) }

            // select a random move from all valid moves
            randomIndex = validMoves[Math.floor(Math.random() * validMoves.length)]
        }
        console.log("shuffled", shuffled_tiles_loc)

        if (!board.current) {
            // setError("No board found");
            return
        }

        const board_empty_elements = [...board.current.children];

        tile_elements.forEach((tile, idx) => {
            const newTile = document.createElement('img');
            newTile.src = tile
            newTile.width = BOARDSIZE / ROWS
            newTile.height = BOARDSIZE / COLUMNS

            const new_location = shuffled_tiles_loc.indexOf(idx);
            board_empty_elements[new_location].replaceWith(newTile);
        })

    }

    useEffect(() => {
        const tile_elements = create_tiles_from_img();
        shuffle_board_tiles(tile_elements);
        // add_click_handlers_tiles();
    },[])

  return (
    <>
        <canvas ref={canvas}></canvas>
        <div className='board' ref={board}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    </>
  )
}
