import { useRef } from "react";

export default function useHold(
  callback: (e: React.TouchEvent | React.MouseEvent) => void = () => {},
  time: number = 1000
) {
  const timeOut = useRef<NodeJS.Timeout | null>(null);
  const isTouchRef = useRef(false);

  const handleHold = (e: React.TouchEvent | React.MouseEvent) => {
    if (e.type === "touchstart") isTouchRef.current = true;
    else if (e.type === "mousedown" && isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }

    timeOut.current = setTimeout(() => {
      callback(e);
      handleRelease();
    }, time);
  };

  const handleRelease = () => {
    clearTimeout(timeOut.current!);
    timeOut.current = null;
  };

  return {
    onMouseDown: handleHold,
    onTouchStart: handleHold,
    onMouseUp: handleRelease,
    onTouchEnd: handleRelease,
    onMouseLeave: handleRelease,
  };
}
