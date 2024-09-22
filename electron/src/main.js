import { app, BaseWindow, WebContentsView, ipcMain, screen } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import contextMenu from "electron-context-menu";

const projectDirname = dirname(fileURLToPath(import.meta.url));

const isLinux = process.platform === "linux";
const isMacOs = process.platform === "darwin";
const isWindows = process.platform === "win32";
const isDev = process.argv.includes("--mode=dev");

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

const createPanel = ({ id, url, x, y, width, height }) => {
  const panel = new WebContentsView({
    webPreferences: {
      nodeIntegration: false,
    },
  });

  panel.setBackgroundColor("#475569");
  panel.webContents.userAgent =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36";

  contextMenu({
    window: panel.webContents,
    showSaveImageAs: true,
    showInspectElement: true,
    showSearchWithGoogle: true,
  });

  mainBaseWindow.contentView.addChildView(panel);

  panel.webContents.loadURL(url);

  panel.setBounds({
    width,
    height,
    x,
    y,
  });

  panel.webContents.on("focus", () => {
    overlayWindow.webContents.send("panel:focused", { name: id });
  });

  panel.webContents.on("page-title-updated", () => {
    const title = panel.webContents.getTitle();
    overlayWindow.webContents.send("PANEL:UPDATE", { id, title });
  });

  panel.webContents.on("update-target-url", () => {
    const url = panel.webContents.getURL();
    overlayWindow.webContents.send("PANEL:UPDATE", { id, url });
  });

  return panel;
};

app.whenReady().then(() => {
  mainBaseWindow = new BaseWindow({
    width: 1200,
    height: 700,
    backgroundColor: "#475569",
    frame: false,
    titleBarStyle: "hidden",
    titleBarOverlay: true,
    titleBarOverlay: {
      color: "#475569",
      symbolColor: "#fff",
      height: 48,
    },
    useContentSize: true,
  });

  if (isWindows) {
    getMaximizedMonitorInfo(mainBaseWindow);
  }

  mainBaseWindow.setBackgroundColor("#475569");

  overlayWindow = new WebContentsView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(projectDirname, "browserPreload.js"),
    },
  });
  overlayWindow.setBackgroundColor("#475569");
  mainBaseWindow.contentView.addChildView(overlayWindow);

  if (isDev) {
    overlayWindow.webContents.loadURL("http://localhost:6080#page=browser");
  } else {
    overlayWindow.webContents.loadFile(
      path.join(projectDirname, "../ui_dist/index.html#page=browser")
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

  ipcMain.on("PANEL:BOUND_UPDATE", (event, data) => {
    const newBounds = {
      height: data.height,
      width: data.width,
      x: data.x,
      y: data.y,
    };

    panels.forEach((panel) => {
      if (panel.id === data.id) {
        panel.wcv.setBounds({
          ...panel.wcv.getBounds(),
          ...newBounds,
        });
      }
    });
  });

  ipcMain.on("PANEL:LOAD_URL", (event, data) => {
    const { id, url } = data;

    panels.forEach((panel) => {
      if (panel.id === id) {
        panel.wcv.webContents.loadURL(url);
      }
    });
  });

  let panels = [];
  ipcMain.on("TAB:CREATE", (event, panel) => {
    const { id } = panel;
    panels = panels.filter((p) => p.id !== id);
    panels.push({
      id,
      wcv: createPanel({
        id,
        url: "http://localhost:6080#page=default-page",
        x: 350,
        y: 50,
        width: 600,
        height: 600,
      }),
    });
  });

  ipcMain.on("TAB:REMOVE", (event, panelId) => {
    const panel = panels.find((panel) => panel.id === panelId);
    console.log("destroy panel:", panel);

    if (panel.wcv && panel.wcv.webContents) {
      mainBaseWindow.contentView.removeChildView(panel.wcv);
      panel.wcv.webContents.destroy();
    }

    panels = panels.filter((panel) => panel.id !== panelId);
  });

  // overlayWindow.webContents.openDevTools();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
