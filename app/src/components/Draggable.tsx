import { createSignal } from "solid-js";

interface Position {
  x: number;
  y: number;
}

interface DraggableProps {
  onResize: (deltaX: number) => void;
  leftViewPortName?: string;
  rightViewPortName?: string;
}

function Draggable(props: DraggableProps) {
  const [isDragging, setIsDragging] = createSignal(false);
  const [startPos, setStartPos] = createSignal<Position>({ x: 0, y: 0 });

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
  };

  return (
    <div
      onMouseDown={handleMouseDown}
      class="select-none bg-slate-600 w-1.5 cursor-col-resize hover:bg-slate-500 transition-colors flex-shrink-0"
    />
  );
}

export default Draggable;
