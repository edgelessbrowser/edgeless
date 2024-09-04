import {
  createSignal,
  onMount,
  onCleanup,
  type Component,
  createEffect,
} from "solid-js";
import BrowserEvents from "./utils/browserEvents";
import useResize from "./hooks/useResize";

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

function ViewPortArea(props: { width: number; name: string }) {
  let tabRef: HTMLDivElement | undefined;

  const [tabBounds, setTabBounds] = createSignal<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  const [widthPercent, setWidthPercent] = createSignal("100%");

  const updateBounds = () => {
    if (tabRef) {
      const bounds = tabRef.getBoundingClientRect();
      const formattedBounds = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
      setTabBounds(formattedBounds);
      BrowserEvents.send("tab:seperator", {
        ...formattedBounds,
        name: props.name,
      });
      console.log("Updated Bounds:", formattedBounds); // Log new bounding client rect
    }
  };

  onMount(() => {
    if (tabRef) {
      // Call updateBounds initially to set initial bounds
      updateBounds();

      // Create a ResizeObserver to watch for changes in the size of the div
      const resizeObserver = new ResizeObserver(() => {
        updateBounds();
      });

      // Start observing the element
      if (tabRef) {
        resizeObserver.observe(tabRef);
      }

      // Cleanup the observer when the component is unmounted
      onCleanup(() => {
        resizeObserver.disconnect();
      });
    }
  });

  createEffect(() => {
    setWidthPercent(`${props.width}%`);
  });

  return (
    <div
      class="bg-slate-700 p-4 min-w-52"
      style={{
        width: widthPercent(),
      }}
      ref={(el) => (tabRef = el)}
    >
      <p class="text-xs mb-2">{widthPercent()}</p>
      <pre class="text-xs">{JSON.stringify(tabBounds(), null, 2)}</pre>
    </div>
  );
}

function OverlayWindowUi() {
  const totalTabs = 2;
  const [leftWidth, setLeftWidth] = createSignal(100 / totalTabs);

  const [tab1Width, setTab1Width] = createSignal(33); // Initial width for tab1
  const [tab2Width, setTab2Width] = createSignal(33); // Initial width for tab2
  const [tab3Width, setTab3Width] = createSignal(33); // Initial width for tab3

  const handleResize = (deltaX: number, tab: number) => {
    const containerWidth = window.innerWidth; // Get the width of the entire container

    if (tab === 1) {
      const newTab1Width = Math.max(
        10,
        Math.min(90, tab1Width() + (deltaX / containerWidth) * 100)
      );
      const newTab2Width = Math.max(
        10,
        Math.min(90, tab2Width() - (deltaX / containerWidth) * 100)
      );
      setTab1Width(newTab1Width);
      setTab2Width(newTab2Width);
    } else if (tab === 2) {
      const newTab2Width = Math.max(
        10,
        Math.min(90, tab2Width() + (deltaX / containerWidth) * 100)
      );
      const newTab3Width = Math.max(
        10,
        Math.min(90, tab3Width() - (deltaX / containerWidth) * 100)
      );
      setTab2Width(newTab2Width);
      setTab3Width(newTab3Width);
    }
  };

  const [viewSidebar, setViewSidebar] = createSignal(true);
  const toggleSidebar = () => setViewSidebar(!viewSidebar());

  // const handleResize = (deltaX: number) => {
  //   const containerWidth = document.documentElement.clientWidth;
  //   const newLeftWidth =
  //     (((leftWidth() * containerWidth) / 100 + deltaX) / containerWidth) * 100;

  //   // Constrain the width to be between 10% and 90%
  //   if (newLeftWidth >= 10 && newLeftWidth <= 90) {
  //     setLeftWidth(newLeftWidth.toFixed(1));
  //   }
  // };

  return (
    <div class="w-screen h-screen bg-slate-600 text-white flex flex-col">
      <div class="bg-neutral-600 text-center">
        <button class="p-2 pl-4" onClick={toggleSidebar}>
          Toggle Sidebar
        </button>
        <input class="w-5/6 p-2" value="https://google.com" type="text" />
        <button class="p-2 pl-4">Go</button>
      </div>

      <div class="flex  h-full">
        <div
          class="flex-shrink-0 border-r-1 border-r-slate-500 transition-[width,opacity] duration-200 transform-gpu mr-1.5"
          style={{
            width: viewSidebar() ? "260px" : "0px",
            opacity: viewSidebar() ? 1 : 0,
            "user-select": viewSidebar() ? "auto" : "none",
          }}
        >
          sidebar
        </div>
        <div class="flex w-full h-full p-1.5 pb-2 pl-0">
          <ViewPortArea width={tab1Width()} name="tab1" />
          <Draggable onResize={(deltaX) => handleResize(deltaX, 1)} />
          <ViewPortArea width={tab2Width()} name="tab2" />
          <Draggable onResize={(deltaX) => handleResize(deltaX, 2)} />
          <ViewPortArea width={tab3Width()} name="tab3" />
        </div>
      </div>
    </div>
  );
}

const App: Component = () => {
  return <OverlayWindowUi />;
};

export default App;
