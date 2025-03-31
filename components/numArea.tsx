interface NumAreaProps {
  exp?: boolean;
}

export default function NumArea(props: NumAreaProps) {
  if (props.exp) {
    return (
      <span className="border-1 border-dashed w-[0.7ch] h-[0.8ch] mb-2 mx-1"></span>
    );
  } else {
    return <span className="border-1 border-dashed w-[1.1ch] h-[1.5ch]"></span>;
  }
}
