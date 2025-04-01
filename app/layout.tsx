import type { Metadata } from "next";
import { Fira_Mono } from "next/font/google";
import { CalcProvider, PopoverProvider } from "@/contexts";
import "./globals.css";
import { TooltipProvider } from "@/contexts/tooltipContext";

export const metadata: Metadata = {
  title: "SDI Calc",
  description: "Calculadora para SDI",
};

const fira = Fira_Mono({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={fira.className}>
      <body className="h-[100dvh] w-screen bg-stone-800 flex flex-col items-center text-stone-100">
        <CalcProvider>
          <TooltipProvider>
            <PopoverProvider>{children}</PopoverProvider>
          </TooltipProvider>
        </CalcProvider>
      </body>
    </html>
  );
}
