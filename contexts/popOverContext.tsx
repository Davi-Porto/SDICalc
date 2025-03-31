"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useRef,
  useEffect,
} from "react";

type PopoverContextType = {
  isOpen: boolean;
  openPopover: (
    element: HTMLElement,
    style?: string,
    children?: ReactNode
  ) => void;
  closePopover: () => void;
  anchor: HTMLElement | null;
};
const popOverContext = createContext<PopoverContextType | undefined>(undefined);

export function PopoverProvider({ children }: { children: ReactNode }) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [style, setStyle] = useState<string | undefined>();
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [popoverChildren, setPopoverChildren] = useState<ReactNode | null>(
    null
  );

  const closePopover = () => setIsOpen(false);

  const openPopover = (
    element: HTMLElement,
    style?: string,
    children?: ReactNode,
    timeout?: number
  ) => {
    if (element) {
      setAnchor(element);
      setRect(element.getBoundingClientRect());
      setStyle(style);
      setPopoverChildren(children);
      setIsOpen(true);

      if (timeout) {
        setTimeout(closePopover, timeout);
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        (event.target as HTMLElement) != anchor &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        closePopover();
      }
    };

    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [anchor, isOpen]);

  return (
    <popOverContext.Provider
      value={{
        isOpen,
        openPopover,
        closePopover,
        anchor,
      }}
    >
      {children}
      {isOpen && anchor && rect && (
        <div
          ref={popoverRef}
          className={style}
          style={{
            position: "absolute",
            top: `${rect.bottom + window.scrollY}px`,
            left: `${rect.left + window.scrollX}px`,
            zIndex: 1000,
          }}
        >
          {popoverChildren}
        </div>
      )}
    </popOverContext.Provider>
  );
}

export function usePopover() {
  const context = useContext(popOverContext);
  if (!context) {
    throw new Error("usePopover must be used within a PopoverProvider");
  }
  return context;
}
