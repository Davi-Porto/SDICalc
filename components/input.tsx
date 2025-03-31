"use client";

import { useCalc } from "@/contexts/calcContext";
import Copy from "@/public/icons/copy.svg";

export default function Input() {
  const { calc, value, answer } = useCalc();

  return (
    <div className="max-w-130 w-full relative border border-stone-100/5 rounded p-2 flex flex-col justify-center">
      <div className="relative w-full p-4 pr-12 min-h-20">
        <p className="w-full h-full text-2xl font-mono text-nowrap overflow-y-hidden overflow-x-scroll custom-scroll flex items-center gap-x-0.5 mt-2">
          {value}
        </p>
        <button
          className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer bg-stone-800 p-2 rounded flex items-center justify-center hover:brightness-125 transition-all duration-100 active:brightness-90"
          onClick={() => navigator.clipboard.writeText(calc.valueS())}
          title="Copiar cálculo."
        >
          <Copy className="size-5" />
        </button>
      </div>
      <div
        className="max-w-130 w-full relative border-t border-stone-100/5 rounded p-4 flex items-center gap-2 cursor-pointer hover:bg-stone-700/20 hover:border-transparent transition-all duration-100 min-h-20"
        onClick={() => navigator.clipboard.writeText(calc.answer)}
        title="Copiar solução."
      >
        <span className="select-none">=</span>
        <div className="h-full text-lg font-mono text-nowrap overflow-y-hidden overflow-x-scroll custom-scroll flex items-center gap-x-0.5 mt-2">
          {answer}
        </div>
      </div>
    </div>
  );
}
