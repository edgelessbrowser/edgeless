import { createSignal, type Component } from "solid-js";
import Draggable from "./components/Draggable";
import ViewPanel from "./components/ViewPanel";
import Sidebar from "./components/Sidebar";
import TopHeader from "./components/TopHeader";

const App: Component = () => {
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

  return (
    <div class="w-screen h-screen bg-slate-600 text-white flex flex-col">
      <TopHeader />

      <div class="flex h-full">
        <Sidebar />
        <div class="flex w-full h-full p-1.5 pb-2 pl-0 pt-0">
          <ViewPanel width={tab1Width()} name="tab1" />
          <Draggable onResize={(deltaX) => handleResize(deltaX, 1)} />
          <ViewPanel width={tab2Width()} name="tab2" />
          <Draggable onResize={(deltaX) => handleResize(deltaX, 2)} />
          <ViewPanel width={tab3Width()} name="tab3" />
        </div>
      </div>
    </div>
  );
};

export default App;
