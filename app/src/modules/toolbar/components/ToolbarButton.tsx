import { JSX } from "solid-js/jsx-runtime";

interface ButtonProps extends JSX.HTMLAttributes<HTMLButtonElement> {
  children: JSX.Element;
}

export default function ToolbarButton(props: ButtonProps) {
  return (
    <button
      title="Toggle Sidebar"
      {...props}
      class={`p-1 win-no-drag hover:bg-slate-700/60 active:bg-slate-700 focus:bg-slate-700 rounded mt-1 transition-[background-color,color] duration-200 text-slate-300/90 ${props.class}`}
    >
      {props.children}
    </button>
  );
}
