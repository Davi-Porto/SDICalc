import NumArea from "@/components/numArea";
import Right from "@/public/icons/right.svg";
import Left from "@/public/icons/left.svg";
import Backspace from "@/public/icons/backspace.svg";
import Trash from "@/public/icons/trash.svg";

export type keyType = {
  value: string;
  keys?: keyType[];
  onClick?: () => void;
  children: React.ReactNode;
  className: string;
  dropDown?: boolean;
  function?: "<" | ">" | "-" | "--";
};

export type keyPadType = keyType[][];

function Key(
  v: string,
  children: React.ReactNode,
  className?: string
): keyType {
  return {
    value: v,
    children: children,
    className: className || "",
  };
}

const dropDownBall =
  "before:absolute before:w-1.5 before:h-1.5 before:rounded-full before:bg-rose-600 before:bottom-1 before:right-1 hover:before:scale-125 transition-all duration-100";

const dDPar: keyType = {
  dropDown: true,
  value: "",
  children: (
    <>
      (<NumArea />)
    </>
  ),
  className: dropDownBall,
  keys: [
    Key(
      "(||)|",
      <>
        (<NumArea />)
      </>
    ),
    Key("(||", "("),
    Key(")||", ")"),
  ],
};

const dDExp: keyType = {
  dropDown: true,
  value: "",
  children: (
    <>
      <NumArea />²
    </>
  ),
  className: dropDownBall,
  keys: [
    Key(
      "[|2|]||",
      <>
        <NumArea />²
      </>
    ),
    Key(
      "[|3|]||",
      <>
        <NumArea />³
      </>
    ),
    Key(
      "[||]|",
      <>
        <NumArea />
        <NumArea exp />
      </>
    ),
  ],
};

const dDInc: keyType = {
  dropDown: true,
  value: "",
  children: <>x</>,
  className: dropDownBall,
  keys: [Key("x||", "x"), Key("y||", "y"), Key("z||", "z")],
};

const funcs: keyType[] = [
  {
    function: "--",
    value: "",
    children: <Trash className="w-4" />,
    className: "!bg-red-400/50 flex-2",
  },
  {
    function: "<",
    value: "",
    children: <Left className="w-5" />,
    className: "",
  },
  {
    function: ">",
    value: "",
    children: <Right className="w-5" />,
    className: "",
  },
  {
    function: "-",
    value: "",
    children: <Backspace className="w-5" />,
    className: "",
  },
];

export const keyPad = [
  funcs,
  [
    dDPar,
    Key("7||", "7", "bg-zinc-700"),
    Key("8||", "8", "bg-zinc-700"),
    Key("9||", "9", "bg-zinc-700"),
    Key("/||", "/"),
  ],
  [
    dDExp,
    Key("4||", "4", "bg-zinc-700"),
    Key("5||", "5", "bg-zinc-700"),
    Key("6||", "6", "bg-zinc-700"),
    Key("*||", "*"),
  ],
  [
    dDInc,
    Key("1||", "1", "bg-zinc-700"),
    Key("2||", "2", "bg-zinc-700"),
    Key("3||", "3", "bg-zinc-700"),
    Key("-||", "-"),
  ],
  [
    Key("=||", "="),
    {
      value: "0||",
      children: "0",
      className: "bg-zinc-700 flex-2",
    },
    Key(".||", "."),
    Key("+||", "+"),
  ],
];
