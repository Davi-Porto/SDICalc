import { useRef } from "react";

export function useLongPress(
  callback: (e: React.TouchEvent | React.MouseEvent) => void,
  delay = 100
) {
  const intervalRef = useRef<number | undefined>(undefined);

  const start = (e: React.TouchEvent | React.MouseEvent) => {
    callback(e); // Executa imediatamente
    intervalRef.current = window.setInterval(() => callback(e), delay); // Executa repetidamente
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
  };
}
