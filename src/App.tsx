import { useEffect } from 'react'
import CroppingTool from './components/CroppingTool';
import GameBoard from './components/GameBoard';
import Timer from './components/Timer';
import { useAppContext } from './context/AppContext';

function App() {
  const context = useAppContext();
  const { 
    croppedImage, gameStarted, 
    ROWS, TILESIZE
   } = context;

  useEffect(() => {
    // Set the CSS variables to ensure they align with javascript state
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) return

    root.style.setProperty('--boardsize', `${ROWS}`);
    root.style.setProperty('--tilesize', `${TILESIZE}px`);
  },[ROWS, TILESIZE]);

  return (
    <main>
      <h1 style={{ textAlign: "center" }}>Sliding Picture Puzzle</h1>

      {!gameStarted &&
        <CroppingTool />
      }
      
      {croppedImage && 
        <div className='preview-wrap'>
          <p>Re-create your image</p>
          <img src={croppedImage.toDataURL()} width={300} height={300} />
        </div>
      }

      {croppedImage && 
        <GameBoard />
      }

      {gameStarted && 
        <Timer />
      }
    </main>
  )
}

export default App
