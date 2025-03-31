"use client";

import { calcI, Calc } from "@/utils/calc";
import {
  createContext,
  JSX,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface CalcContextType {
  calc: Calc;

  value: JSX.Element[];
  answer: JSX.Element[];

  changeValue: (value: string) => void;
  calculate: () => void;
}

export const CalcContext = createContext<CalcContextType | undefined>(
  undefined
);

interface CalcProviderProps {
  children: ReactNode;
}
export function CalcProvider({ children }: CalcProviderProps) {
  const calc = calcI;
  const [value, setValue] = useState(calc.valueE());
  const [answer, setAnswer] = useState(calc.answerE());

  const calculate = useCallback(() => {
    calc.calc();
    setAnswer(calc.answerE());
  }, [calc]);

  const changeValue = useCallback(
    (vl: string) => {
      calc.rawValue(/\|$/.test(vl) ? vl : vl + "|");
      setValue(calc.valueE());
      calculate();
    },
    [calc, calculate]
  );

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const key = event.key;
      const shift = event.shiftKey;

      if (/^[\d+\-*/.=xyz]$/.test(key)) {
        calc.rawValue(key + "||");
        changeValue("");
      } else if (
        key === "Backspace" ||
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "Tab" ||
        key === "Enter" ||
        key === "Delete" ||
        key === "Home" ||
        key === "End" ||
        key === "Dead" ||
        key === "Escape"
      ) {
        if (key === "Backspace") calc.backspace();
        else if (key === "ArrowLeft" || (shift && key === "Tab"))
          calc.cursorLeft();
        else if (
          key === "ArrowRight" ||
          (key === "Tab" && !shift) ||
          key === "Enter"
        )
          calc.cursorRight();
        else if (key === "Delete") calc.del();
        else if (key === "Home") calc.home();
        else if (key === "End") calc.end();
        else if (key === "Dead" && shift) calc.rawValue("[||]|");
        else if (key === "Escape") calc.clear();

        if (key === "Tab") event.preventDefault();

        changeValue("");
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [calc, changeValue]);

  return (
    <CalcContext.Provider
      value={{ calc, value, changeValue, answer, calculate }}
    >
      {children}
    </CalcContext.Provider>
  );
}
export function useCalc() {
  const context = useContext(CalcContext);
  if (!context) {
    throw new Error("useCalc must be used within a CalcProvider");
  }
  return context;
}
