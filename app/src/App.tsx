import { type Component } from "solid-js";
import Sidebar from "./modules/sidebar/components/Sidebar";
import WindowToolbar from "./modules/toolbar/components/WindowToolbar";
import EdgelessWindow from "./modules/window/components/EdgelessWindow";
import ViewPanelContainer from "./modules/webview-panels/components/ViewPanelContainer";
import Box from "./modules/ui/components/Box";

const App: Component = () => {
  return (
    <EdgelessWindow>
      <WindowToolbar />

      <Box class="flex h-full">
        <Sidebar />
        <ViewPanelContainer />
      </Box>
    </EdgelessWindow>
  );
};

export default App;
