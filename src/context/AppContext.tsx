import { createContext, ReactNode, useContext, useState } from 'react';

type ContextProps = {
  croppedImage: HTMLCanvasElement | null;
  setCroppedImage: (img: HTMLCanvasElement | null) => void;

  gameEnded: boolean;
  setGameEnded: (val: boolean) => void;

  gameStarted: boolean;
  setGameStarted: (val: boolean) => void;

  BOARDSIZE: number;
  TILESIZE: number;
  ROWS: number;
  COLUMNS: number;
};

const AppContext = createContext<ContextProps | undefined>(undefined);

// Create a provider component
export const AppProvider = ({ children } : { children: ReactNode }) => {
  const [croppedImage, setCroppedImage] = useState<HTMLCanvasElement | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const [BOARDSIZE] = useState(400);
  const [TILESIZE] = useState(100);
  const [ROWS] = useState(BOARDSIZE / TILESIZE);
  const [COLUMNS] = useState(BOARDSIZE / TILESIZE);

  return (
    <AppContext.Provider
        value={{
          croppedImage, setCroppedImage,
          gameEnded, setGameEnded,
          gameStarted, setGameStarted,
          BOARDSIZE,
          TILESIZE,
          ROWS,
          COLUMNS,
        }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): ContextProps => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('App context error');
  }
  return context;
};