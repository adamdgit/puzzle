import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext';

export default function Timer() {
    const { gameEnded, gameStarted } = useAppContext();

    const [mins, setMins] = useState('00');
    const [secs, setSecs] = useState('00');
    const time = useRef(0);
    const timerRef = useRef<number | null>(null);

    function formatTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        setMins(`${String(minutes).padStart(2, '0')}`) 
        setSecs(`${String(seconds).padStart(2, '0')}`)
    }

    useEffect(() => {
        // add to timer while game is active
        if (gameStarted && !gameEnded) {
            timerRef.current = window.setInterval(() => {
                time.current += 1;
                formatTime(time.current);
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    },[gameStarted, gameEnded])

  return (
    <div className='timer'>
        <span>Time: </span>
        <span>{mins}</span>
        <span>:</span>
        <span>{secs}</span>
    </div>
  )
}
