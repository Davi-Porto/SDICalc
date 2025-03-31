import type { Metadata } from "next";
import { Fira_Mono } from "next/font/google";
import { CalcProvider, PopoverProvider } from "@/contexts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculadora de Polinômios",
  description: "Calculadora de Polinômios",
};

const fira = Fira_Mono({ subsets: ["latin"], weight: "400" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={fira.className}>
      <body className="h-screen w-screen bg-stone-800 flex flex-col items-center text-stone-100">
        <CalcProvider>
          <PopoverProvider>{children}</PopoverProvider>
        </CalcProvider>
      </body>
    </html>
  );
}
