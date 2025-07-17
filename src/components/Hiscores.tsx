import { useEffect, useState } from 'react'
import { formatTime } from '../utils/formatTime';

type LShiscores = {
    imgDataURL: string;
    score: number;
}

export default function Hiscores() {
    const [hiscores, setHiscores] = useState<LShiscores[]>([]);

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
            <h1>Hiscores</h1>
            {hiscores.length > 0 ? 
                hiscores.map((x, i) => {
                    const [mins, secs] = formatTime(x.score)
                    return <li key={i}>
                        <span>Time: {mins}:{secs}</span>
                        <img src={x.imgDataURL} alt='img preview' width={100} height={100}/>
                    </li>
                })
                : <p>No Hiscores found.</p>
            }
        </ul>
    </div>
  )
}
