import { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import { formatTime } from '../utils/formatTime';

type LShiscores = {
    imgDataURL: string;
    score: number;
}

export default function Timer() {
    const { gameStarted, gameEnded, croppedImage } = useAppContext();
    const [mins, setMins] = useState('00');
    const [secs, setSecs] = useState('00');
    const time = useRef(0);
    const timerRef = useRef<number | null>(null);

    function updateHiscores() {
        const key = 'hiscore';
        const currentTime = time.current;
        let scores: LShiscores[] = [];

        try {
            const storage = localStorage.getItem(key);
            if (storage) {
                scores = JSON.parse(storage);
            }
        } catch (err) {
            console.error("Failed to parse high scores from localStorage", err);
        }

        // Create new canvas to shrink game image for local storage hiscores
        const canvas = document.createElement('canvas');
        const HISCOREIMGSIZE = 100 // pixels
        canvas.width = HISCOREIMGSIZE;
        canvas.height = HISCOREIMGSIZE;
        const ctx = canvas.getContext('2d');

        if (!ctx || !croppedImage) return

        ctx.drawImage(croppedImage, 0, 0, HISCOREIMGSIZE, HISCOREIMGSIZE);

        const imgDataURL =  canvas?.toDataURL() ?? '';
        // save small img and time
        scores.push({ imgDataURL: imgDataURL, score: currentTime });
        scores = scores.sort((a, b) => a.score - b.score).slice(0, 10);

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
                const [mins, secs] = formatTime(time.current)
                setMins(mins);
                setSecs(secs);
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
