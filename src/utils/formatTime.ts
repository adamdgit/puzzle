export function formatTime(time: number) {
    const mins = String(Math.floor(time / 60)).padStart(2, '0');
    const secs = String(time % 60).padStart(2, '0');

    return [mins, secs]
}