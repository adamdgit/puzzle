import { useState } from 'react'
import CroppingTool from './components/CroppingTool';
import GameBoard from './components/GameBoard';

function App() {
  const [croppedImage, setCroppedImage] = useState<HTMLCanvasElement | null>(null);

  return (
    <main>
      <h1>Picture Puzzle Game</h1>

      <CroppingTool
        setCroppedImage={setCroppedImage}
       />

      {croppedImage && (
        <img src={croppedImage.toDataURL()} alt="Cropped" />
      )}

      {croppedImage && 
        <GameBoard gameImage={croppedImage} />
      }
    </main>
  )
}

export default App
