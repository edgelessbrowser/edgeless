import ViewPanelState from "../store/ViewPanelState";
import BrowserEvents from "../../../utils/browserEvents";

export function addNewTab() {
  const panel = ViewPanelState.addPanel();
  if (panel) {
    ViewPanelState.setAsVisible(panel.id);
    BrowserEvents.send("TAB:CREATE", panel);
  }
}

export function removeTab(id: string) {
  ViewPanelState.removePanel(id);
  BrowserEvents.send("TAB:REMOVE", id);
}
