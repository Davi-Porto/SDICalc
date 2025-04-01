"use client";

import { useCalc } from "@/contexts/calcContext";
import { useTooltip } from "@/contexts/tooltipContext";
import useHold from "@/hooks/useHold";
import Copy from "@/public/icons/copy.svg";

export default function Input() {
  const { calc, value, answer } = useCalc();
  const { openTooltip } = useTooltip();

  const holdEvents = useHold((e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();

    const x = rect.left + rect.width / 2;
    const y = rect.top - 8;

    openTooltip(x, y, 2000, "Copiado!");
    navigator.clipboard.writeText(calc.answer);
  }, 200);

  return (
    <div className="max-w-130 w-full relative border border-stone-100/5 rounded p-2 flex flex-col justify-center select-none">
      <div className="relative w-full p-4 pr-12 min-h-20">
        <p className="w-full h-full text-2xl font-mono text-nowrap overflow-y-hidden overflow-x-scroll custom-scroll flex items-center gap-x-0.5 mt-2">
          {value}
        </p>
        <button
          className="absolute top-1/2 right-1 -translate-y-1/2 cursor-pointer bg-stone-800 p-2 rounded flex items-center justify-center hover:brightness-125 transition-all duration-100 active:brightness-90 active:text-emerald-500"
          onClick={() => navigator.clipboard.writeText(calc.valueS())}
          title="Copiar cálculo."
        >
          <Copy className="size-5" />
        </button>
      </div>
      <div
        className="max-w-130 w-full relative border-t border-stone-100/5 rounded p-4 flex items-center gap-2 cursor-pointer bg-stone-700/20 hover:brightness-125 hover:border-transparent transition-all duration-100 min-h-20"
        {...holdEvents}
        title="Copiar solução."
      >
        <span className="select-none">=</span>
        <div className="h-full text-xl font-mono text-nowrap overflow-y-hidden overflow-x-scroll custom-scroll flex items-center gap-x-0.5 mt-2">
          {answer}
        </div>
      </div>
    </div>
  );
}
