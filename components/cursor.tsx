import { Key } from "react";

interface cursorProps {
  exp: boolean;
  expI: number;
  k?: Key | null | undefined;
}

export default function Cursor(props: cursorProps) {
  return (
    <span
      key={props.k}
      className={`bg-white w-0.25 animate-(--animate-blink)`}
      style={{
        height: !props.exp ? "20px" : "12px",
        marginBottom: !props.exp ? "0px" : `${props.expI * 12}px`,
        paddingBottom: "8px",
      }}
    ></span>
  );
}
