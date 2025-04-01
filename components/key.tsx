"use client";

import { useCalc } from "@/contexts/calcContext";
import { useLongPress } from "@/hooks/useLongPress";

interface keyProps {
  value: string;
  onClick: (e: React.TouchEvent | React.MouseEvent) => void;
  children: React.ReactNode;
  className: string;
  dropDown?: boolean;
  function?: "<" | ">" | "-" | "--";
}

export default function Key(props: keyProps) {
  const { calc, changeValue } = useCalc();

  const handleFunction = (e: React.TouchEvent | React.MouseEvent) => {
    props.onClick(e);
    if (!props.dropDown && !props.function) {
      changeValue(props.value);
    } else if (props.function) {
      if (props.function == "<") {
        calc.cursorLeft();
      } else if (props.function == ">") {
        calc.cursorRight();
      } else if (props.function == "-") {
        calc.backspace();
      } else {
        calc.clear();
      }
      changeValue("");
    }
  };

  const longPressEvents = useLongPress(handleFunction);
  const events = props.function ? longPressEvents : { onClick: handleFunction };

  return (
    <div
      {...events}
      className={`rounded w-full h-full flex-1 text-2xl bg-stone-600 flex items-center justify-center cursor-pointer hover:brightness-125 transition-all duration-100 active:brightness-90 select-none relative after:absolute after:size-full ${props.className}`}
    >
      {props.children}
    </div>
  );
}
