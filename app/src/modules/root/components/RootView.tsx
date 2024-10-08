import Box from "../../ui/components/Box";
import Sidebar from "../../sidebar/components/Sidebar";
import WindowToolbar from "../../toolbar/components/WindowToolbar";
import EdgelessWindow from "../../window/components/EdgelessWindow";
import ViewPanelContainer from "../../webview-panels/components/ViewPanelContainer";
import useEvents from "../../../hooks/useEvents";

export default function RootView() {
  useEvents({
    channel: "BROWSER:GET_SYSTEM_INFO",
    broadcast: true,
    callback: (data) => {
      console.log("System Info:", data);
    },
  });

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
