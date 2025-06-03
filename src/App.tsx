import { useEffect } from 'react'
import CroppingTool from './components/CroppingTool';
import GameBoard from './components/GameBoard';
import Timer from './components/Timer';
import { useAppContext } from './context/AppContext';
import { AnimatePresence, motion } from 'motion/react';

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

      <AnimatePresence mode="wait">
        {!gameStarted &&
          <motion.div
            key="crop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{display: 'grid', gap: '1rem'}}
          >
            <CroppingTool />
          </motion.div>
        }
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {gameStarted && 
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
          </motion.div>
        }
      </AnimatePresence>
    </main>
  )
}

export default App
