import Input from "@/components/input";
import Keyboard from "@/components/keyboard";

export default function Home() {
  return (
    <main className="h-[100dvh] w-full flex flex-col items-center justify-between md:justify-start py-10 px-4 md:px-0 gap-15">
      <Input />
      <Keyboard />
    </main>
  );
}
