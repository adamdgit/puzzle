import { useAppContext } from '../context/AppContext';

export default function RestartGameBtn() {
  const { 
    setGameEnded, setGameStarted, setCroppedImage
  } = useAppContext();

  function handleRestartGame() {
    setCroppedImage(null);
    setGameStarted(false);
    setGameEnded(false);
  };

  return (
    <button
      style={{margin: '1rem auto'}}
      className='restart-btn' 
      onClick={handleRestartGame}>
        Restart Game
    </button>
  )
}
