import { useEffect, useState } from 'react'
import CroppingTool from './components/CroppingTool';
import GameBoard from './components/GameBoard';

function App() {
  const [croppedImage, setCroppedImage] = useState<HTMLCanvasElement | null>(null);

  const [BOARDSIZE] = useState(400);
  const [TILESIZE] = useState(100);
  const [ROWS] = useState(BOARDSIZE / TILESIZE);
  const [COLUMNS] = useState(BOARDSIZE / TILESIZE);

  useEffect(() => {
    // Set the CSS variables to ensure they align with javascript state
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) return

    root.style.setProperty('--boardsize', `${ROWS}`);
    root.style.setProperty('--tilesize', `${TILESIZE}px`);
  },[ROWS, TILESIZE]);

  return (
    <main>
      <h1 style={{textAlign: "center"}}>Sliding Picture Puzzle</h1>

      <CroppingTool
        setCroppedImage={setCroppedImage}
        BOARDSIZE={BOARDSIZE}
       />

      {/* {croppedImage && (
        <img src={croppedImage.toDataURL()} alt="Cropped" />
      )} */}

      {croppedImage && 
        <GameBoard 
          gameImage={croppedImage} 
          BOARDSIZE={BOARDSIZE}
          ROWS={ROWS}
          COLUMNS={COLUMNS}
        />
      }
    </main>
  )
}

export default App
