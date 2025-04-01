import { useRef } from "react";

export function useLongPress(
  callback: (e: React.TouchEvent | React.MouseEvent) => void,
  delay = 100
) {
  const intervalRef = useRef<number | null>(null);
  const isTouchRef = useRef(false);

  const start = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === "touchstart") isTouchRef.current = true;
    else if (e.type === "mousedown" && isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }

    callback(e);
    intervalRef.current = window.setInterval(() => callback(e), delay);
  };

  const stop = () => {
    clearInterval(intervalRef.current!);
    intervalRef.current = null;
  };

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: stop,
    onTouchEnd: stop,
    onMouseLeave: stop,
  };
}
