import { app, BaseWindow, WebContentsView, ipcMain, screen } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import contextMenu from "electron-context-menu";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.argv.includes("--mode=dev");
const isWindows = process.platform === "win32";
const isMacOs = process.platform === "darwin";
const isLinux = process.platform === "linux";

function getMaximizedMonitorInfo(mainWindow) {
  mainWindow.on("maximize", () => {
    // Get the current window bounds
    const windowBounds = mainWindow.getBounds();

    // Get the display that contains the majority of the window
    const display = screen.getDisplayMatching(windowBounds);

    // Extract monitor information
    const monitorInfo = {
      id: display.id,
      width: display.size.width,
      height: display.size.height,
      scaleFactor: display.scaleFactor, // Scale factor is related to DPI
      dpi: display.scaleFactor * 96, // Common DPI calculation (96 is standard DPI for 100%)
    };

    // Log monitor info or send it to the renderer process
    console.log("Maximized on Monitor:", monitorInfo);
    // mainWindow.webContents.send("monitor-info", monitorInfo);
    overlayWindow.webContents.send("baseWindow:sizeUpdate", {
      width: monitorInfo.width,
      height: monitorInfo.height,
    });
  });
}

let mainBaseWindow;
let overlayWindow;

let tab1;
let tab2;
let tab3;

const createTab = ({ url, x, y, width, height, name }) => {
  const tab = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  contextMenu({
    window: tab.webContents, // Specify the webContents where the context menu should be applied
    showSaveImageAs: true, // Example: Enable "Save Image As..." option
    showInspectElement: true, // Example: Enable "Inspect Element" option for debugging
    showSearchWithGoogle: true, // Example: Enable "Search with Google" option
  });

  mainBaseWindow.contentView.addChildView(tab);

  tab.webContents.loadURL(url);

  tab.setBounds({
    width,
    height,
    x,
    y,
  });

  tab.webContents.on("focus", () => {
    overlayWindow.webContents.send("tab:focused", { name });
  });

  return tab;
};

app.whenReady().then(() => {
  mainBaseWindow = new BaseWindow({
    width: 1200,
    height: 700,
    backgroundColor: "#475569",
    frame: false,
    // roundedCorners: false,
    titleBarStyle: "hidden",
    titleBarOverlay: true,
    // thickFrame: false,
    titleBarOverlay: {
      color: "#475569",
      symbolColor: "#fff",
      height: 40,
    },
    useContentSize: true,
  });

  if (isWindows) {
    getMaximizedMonitorInfo(mainBaseWindow);
  }

  // Set based window bounds on base ui view panel to fix windows screen width issue and a fixed border.

  mainBaseWindow.setBackgroundColor("#475569");

  overlayWindow = new WebContentsView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "browserPreload.js"),
    },
  });
  mainBaseWindow.contentView.addChildView(overlayWindow);

  if (isDev) {
    overlayWindow.webContents.loadURL("http://localhost:6080");
  } else {
    overlayWindow.webContents.loadFile(
      path.join(__dirname, "../ui_dist/index.html")
    );
  }

  overlayWindow.setBounds({ ...mainBaseWindow.getBounds(), x: 0, y: 0 });

  mainBaseWindow.on("resize", () => {
    overlayWindow.setBounds({ ...mainBaseWindow.getBounds(), x: 0, y: 0 });
  });

  if (isWindows) {
    mainBaseWindow.on("resize", () => {
      const newBounds = mainBaseWindow.getBounds();
      if (mainBaseWindow.isMaximized()) {
        // overlayWindow.webContents.send("baseWindow:sizeUpdate", {
        //   width: newBounds.width - 16,
        //   height: newBounds.height - 18,
        // });
      } else {
        overlayWindow.webContents.send("baseWindow:sizeUpdate", newBounds);
      }
    });

    mainBaseWindow.on("ready-to-show", () => {
      const newBounds = mainBaseWindow.getBounds();
      overlayWindow.webContents.send("baseWindow:sizeUpdate", newBounds);
    });
  }

  ipcMain.on("TAB:BOUND_UPDATE", (event, data) => {
    const newBounds = {
      height: data.height,
      width: data.width,
      x: data.x,
      y: data.y,
    };

    // console.log("newBounds", newBounds);
    if (data.name === "tab1" && tab1) {
      // tab1.setBounds({
      //   ...tab1.getBounds(),
      //   width: data.width,
      // });
      tab1.setBounds({
        ...tab1.getBounds(),
        ...newBounds,
      });
    } else if (data.name === "tab2" && tab2) {
      tab2.setBounds({
        ...tab2.getBounds(),
        ...newBounds,
        // width: data.width,
        // x: data.x,
      });
    } else if (data.name === "tab3" && tab3) {
      tab3.setBounds({
        ...tab3.getBounds(),
        ...newBounds,
        // width: data.width,
        // x: data.x,
      });
    }

    event.sender.send("fromMain", "Hello from Main");
  });

  // overlayWindow.webContents.openDevTools();

  const showTabs = true;

  if (showTabs) {
    tab1 = createTab({
      url: "https://news.ycombinator.com",
      x: 200,
      y: 40,
      width: 296,
      height: 540,
      name: "tab1",
    });

    tab2 = createTab({
      url: "https://duck.com/",
      x: 504,
      y: 40,
      width: 296,
      height: 540,
      name: "tab2",
    });

    tab3 = createTab({
      url: "https://react.dev/",
      x: 504,
      y: 40,
      width: 296,
      height: 540,
      name: "tab3",
    });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
