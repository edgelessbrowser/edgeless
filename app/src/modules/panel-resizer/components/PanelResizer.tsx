import { createSignal } from "solid-js";
import PanelResizerState from "../store/PanelResizerState";

interface Position {
  x: number;
  y: number;
}

interface PanelResizerProps {
  onResize: (deltaX: number) => void;
  leftViewPortName?: string;
  rightViewPortName?: string;
}

function PanelResizer(props: PanelResizerProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const [startPos, setStartPos] = createSignal<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    PanelResizerState.setIsResizing(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging()) return;

    const deltaX = e.clientX - startPos().x;

    props.onResize(deltaX); // Call the resize handler with the deltaX

    setStartPos({ x: e.clientX, y: e.clientY });
    console.log("mouse move");
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    PanelResizerState.setIsResizing(false);
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      class="select-none bg-slate-600 w-[5px] cursor-col-resize hover:bg-slate-500 transition-colors flex-shrink-0 mt-0.5"
    />
  );
}

export default PanelResizer;
