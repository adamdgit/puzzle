import { useEffect, useState } from 'react'
import CroppingTool from './components/CroppingTool';
import GameBoard from './components/GameBoard';
import Timer from './components/Timer';
import { useAppContext } from './context/AppContext';
import { AnimatePresence, motion } from 'motion/react';
import Hiscores from './components/Hiscores';
import RestartGameBtn from './components/RestartGameBtn';

function App() {
  const { 
    croppedImage, gameStarted,
    ROWS, TILESIZE
  } = useAppContext();

  const [showHiscores, setShowHiscores] = useState(false);

  useEffect(() => {
    // Set the CSS variables to ensure they align with javascript state
    const root = document.querySelector(':root') as HTMLElement;
    if (!root) return

    root.style.setProperty('--boardsize', `${ROWS}`);
    root.style.setProperty('--tilesize', `${TILESIZE}px`);
  },[ROWS, TILESIZE]);

  return (
    <main>
      <button 
        className='hiscore-btn'
        onClick={() => setShowHiscores(!showHiscores)}
      >
        hiscores
      </button>
      {showHiscores && <Hiscores />}

      <h1 style={{ textAlign: "center", marginTop: '1rem' }}>Sliding Picture Puzzle</h1>

      <AnimatePresence mode="wait">
        {!gameStarted &&
          <motion.div
            key="crop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{display: 'grid', gap: '1rem', justifyItems: 'center'}}
          >
            <CroppingTool />
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {(gameStarted && croppedImage) && 
          <motion.div
            key="crop"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, delay: 0.45 }}
          >
            <div className='preview-wrap'>
              <p>Re-create your image</p>
              <img src={croppedImage?.toDataURL() ?? ''} width={300} height={300} />
            </div>

            <GameBoard />

            <Timer />

            <RestartGameBtn />
          </motion.div>
        }
      </AnimatePresence>
    </main>
  )
}

export default App
