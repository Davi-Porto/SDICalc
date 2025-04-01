"use client";

import { createContext, useContext, useState } from "react";

interface TooltipContextType {
  isOpen: boolean;
  openTooltip: (
    x: number,
    y: number,
    timeout: number,
    children?: React.ReactNode
  ) => void;
}

export const TooltipContext = createContext<TooltipContextType | undefined>(
  undefined
);

export const TooltipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [body, setBody] = useState<React.ReactNode | null>(null);

  const openTooltip = (
    x: number,
    y: number,
    timeout: number = 200,
    children?: React.ReactNode
  ) => {
    setCoords({ x, y });
    setBody(children);
    setIsOpen(true);
    setTimeout(closeTooltip, timeout);
  };

  const closeTooltip = () => setIsOpen(false);

  return (
    <TooltipContext.Provider value={{ isOpen, openTooltip }}>
      {isOpen && (
        <div
          className="absolute bg-black p-1 rounded text-xs -translate-x-1/2 -translate-y-full min-w-7.5 opacity-0 animate-fadeIn before:h-3/10 before:aspect-square before:-rotate-45 before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:translate-y-1/2 before:bg-black before:-z-10 before:absolute"
          style={{ top: coords.y, left: coords.x }}
        >
          {body}
        </div>
      )}
      {children}
    </TooltipContext.Provider>
  );
};

export const useTooltip = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("useTooltip must be used within a tooltipProvider");
  }
  return context;
};
