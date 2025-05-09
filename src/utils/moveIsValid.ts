type blankLocation = "up" | "down" | "left" | "right" | null;

export function move_is_valid(target_idx: number, blank_idx: number, COLS: number): blankLocation {
    const row1 = Math.floor(target_idx / COLS);
    const col1 = target_idx % COLS;
    const row2 = Math.floor(blank_idx / COLS);
    const col2 = blank_idx % COLS;

    if (row1 === row2) {
      if (col1 - col2 === 1) return "left";
      if (col1 - col2 === -1) return "right";
    }
  
    if (col1 === col2) {
      if (row1 - row2 === 1) return "up";
      if (row1 - row2 === -1) return "down";
    }

    return null;
  };