import { useState } from 'react'
import CroppingTool from './components/CroppingTool';
import GameBoard from './components/GameBoard';

function App() {
  const [croppedImage, setCroppedImage] = useState<HTMLCanvasElement | null>(null);
  const [BOARDSIZE] = useState(440);
  const [ROWS] = useState(4);
  const [COLUMNS] = useState(4);

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
