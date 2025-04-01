"use client";

import { useCalc, usePopover } from "@/contexts";
import Key from "./key";
import { keyPad } from "@/utils/keyPad";
import { useEffect } from "react";

export default function Keyboard() {
  const { openPopover, closePopover } = usePopover();
  const { calculate } = useCalc();

  useEffect(() => {
    console.clear();
    calculate();
  }, [calculate]);

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="fixed bottom-0 xs:relative xs:w-80 flex flex-col gap-0.5 w-full aspect-square overflow-hidden">
        {keyPad.map((k, i) => (
          <div key={i} className="flex flex-nowrap gap-0.5 h-full">
            {k.map((v, j) => {
              if (v.keys) {
                return (
                  <Key
                    dropDown
                    value=""
                    key={`${i}-${j}`}
                    className={v.className}
                    onClick={(e) => {
                      const target = e.target as HTMLDivElement;
                      const body = (
                        <>
                          {v.keys?.map(
                            (k2, i2) =>
                              k2 && (
                                <Key
                                  key={`${i}-${j}-${i2}`}
                                  value={k2.value}
                                  className={`${k2.className} !w-[calc(100vw/5_-4px)] aspect-square xs:!w-[calc(theme(space.80)/5_-4px)]`}
                                  onClick={() => {
                                    closePopover();
                                  }}
                                >
                                  {k2.children}
                                </Key>
                              )
                          )}
                        </>
                      );
                      openPopover(
                        target,
                        "bg-stone-800 p-1 rounded rounded-bl-none flex gap-1 -translate-y-1/1 shadow-xl",
                        body
                      );
                    }}
                  >
                    {v.children}
                  </Key>
                );
              }
              return (
                <Key
                  dropDown={v.dropDown}
                  function={v.function}
                  key={`${i}-${j}`}
                  value={v.value}
                  className={v.className}
                  onClick={() => {}}
                >
                  {v.children}
                </Key>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
