import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext';

export default function Timer() {
    const { gameStarted, gameEnded } = useAppContext();
    const [mins, setMins] = useState('00');
    const [secs, setSecs] = useState('00');
    const time = useRef(0);
    const timerRef = useRef<number | null>(null);

    function updateHiscores() {
        const key = 'hiscore';
        const currentTime = time.current;
        let scores: number[] = [];

        try {
            const storage = localStorage.getItem(key);
            if (storage) {
                scores = JSON.parse(storage);
            }
        } catch (err) {
            console.error("Failed to parse high scores from localStorage", err);
        }

        scores.push(currentTime);
        scores = scores.sort((a, b) => a - b).slice(0, 10);

        try {
            localStorage.setItem(key, JSON.stringify(scores));
        } catch (err) {
            console.error("Failed to save high scores", err);
        }
    }

    useEffect(() => {
        // add to timer while game is active
        if (gameStarted && !gameEnded) {
            timerRef.current = setInterval(() => {
                time.current += 1;
                setMins(String(Math.floor(time.current / 60)).padStart(2, '0'));
                setSecs(String(time.current % 60).padStart(2, '0'))
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    },[gameStarted, gameEnded]);

    useEffect(() => {
        if (gameEnded) {
            updateHiscores();
        }
    },[gameEnded]);

  return (
    <div className='timer'>
        <span>Time: {mins}:{secs}</span>
    </div>
  )
}
