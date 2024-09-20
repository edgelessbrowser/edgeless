import Box from "../../ui/components/Box";
import Sidebar from "../../sidebar/components/Sidebar";
import WindowToolbar from "../../toolbar/components/WindowToolbar";
import EdgelessWindow from "../../window/components/EdgelessWindow";
import ViewPanelContainer from "../../webview-panels/components/ViewPanelContainer";

export default function EdgelessBrowserRootView() {
  return (
    <EdgelessWindow>
      <WindowToolbar />

      <Box class="flex h-full">
        <Sidebar />
        <ViewPanelContainer />
      </Box>
    </EdgelessWindow>
  );
}
