import { createSignal, createRoot } from "solid-js";
import { createStore } from "solid-js/store";

export interface PanelInterface {
  id?: string;
  index?: number;
  title?: string;
  url?: string;
  icon?: string;
  loading?: boolean;
  progress?: number;
  canGoBack?: boolean;
  canGoForward?: boolean;
  isFocused?: boolean;
  width?: number;
  isVisible?: boolean;
}

const createPanel = ({
  index = 0,
  title = "New Edgeless Tab",
  url = "",
  icon = "",
  loading = true,
  progress = 0,
  canGoBack = false,
  canGoForward = false,
  isFocused = true,
  width = 100,
  isVisible = true,
}: PanelInterface) => {
  return {
    id: String(Math.random()),
    index,
    title,
    url,
    icon,
    loading,
    progress,
    canGoBack,
    canGoForward,
    isFocused,
    width,
    isVisible,
  };
};

function ViewPanelState() {
  const [tabWidth, setTabWidth] = createSignal(100);
  const [focuedTab, setFocusedTab] = createSignal("");

  const [panels, setPanels] = createStore<PanelInterface[]>([
    createPanel({ index: 0, isFocused: true }),
  ]);

  const addPanel = (panel?: PanelInterface) => {
    const newPanel = createPanel(panel || {});
    setPanels(panels.length, newPanel);
    return newPanel;
  };

  const removePanel = (id: string) => {
    setPanels((panels) => panels.filter((panel) => panel.id !== id));
  };

  const updatePanel = (id: string, columnName: any, columnValue: any) => {
    setPanels((panel) => panel.id === id, columnName, columnValue);
  };

  const setAsVisible = (id: string) => {
    const visiblePanel = getVisiblePanel();
    if (visiblePanel) {
      updatePanel(visiblePanel.id || "", "isVisible", false);
    }

    updatePanel(id, "isVisible", true);
  };

  const getVisiblePanel = (): PanelInterface | undefined => {
    return panels.find((panel) => panel.isVisible);
  };

  return {
    tabWidth,
    setTabWidth,
    focuedTab,
    setFocusedTab,
    panels,
    addPanel,
    removePanel,
    updatePanel,
    setAsVisible,
    getVisiblePanel,
  };
}

export default createRoot(ViewPanelState);