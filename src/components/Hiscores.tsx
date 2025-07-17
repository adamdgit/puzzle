import { useEffect, useState } from 'react'

export default function Hiscores() {
    const [hiscores, setHiscores] = useState<number[]>([]);

    useEffect(() => {
        // Fetch hiscores on mount
        const storage = localStorage.getItem('hiscore');
        if (storage) {
            try {
                const data = JSON.parse(storage);
                setHiscores(data);
            } catch (err) {
                console.error("Failed to parse high scores from localStorage", err);
            }
        }
    },[])

  return (
    <div className='hiscore-wrap'>
        <ul className='hiscores'>
            <h2>Hiscores</h2>
            {hiscores.length > 0 ? 
                hiscores.map((score, i) => {
                    const mins = Math.floor(Number(score) / 60);
                    const secs = Number(score) % 60;
                    const formatmins = `${String(mins).padStart(2, '0')}`
                    const formatsecs = `${String(secs).padStart(2, '0')}`
                    return <li key={i}>Time: {formatmins}:{formatsecs}</li>
                })
                : <p>No Hiscores found.</p>
            }
        </ul>
    </div>
  )
}
