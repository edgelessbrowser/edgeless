import { type Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

interface BoxProps extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element;
}

const Box: Component<BoxProps> = (props: BoxProps) => {
  return <div {...props}>{props.children}</div>;
};

export default Box;
