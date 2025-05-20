import { useEffect, useRef, useState } from 'react'

export default function Timer({ gameStarted, gameEnded }: {
    gameStarted: boolean,
    gameEnded: boolean
}) {
    const [_, setTime] = useState(0);
    const [mins, setMins] = useState('00');
    const [secs, setSecs] = useState('00');
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
            timerRef.current = setInterval(() => {
                setTime(prev => {
                    prev += 1;
                    formatTime(prev)
                    return prev
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    },[gameStarted, gameEnded])

  return (
    <div className='timer'>
        <span>{mins}</span>
        <span>:</span>
        <span>{secs}</span>
    </div>
  )
}
