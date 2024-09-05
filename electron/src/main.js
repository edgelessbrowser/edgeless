import { app, BaseWindow, WebContentsView, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.argv.includes("--mode=dev");

let mainBaseWindow;
let overlayWindow;

let tab1;
let tab2;

const createTab = ({ url, x, y, width, height }) => {
  const tab = new WebContentsView({
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainBaseWindow.contentView.addChildView(tab);
  tab.webContents.loadURL(url);

  tab.setBounds({
    width,
    height,
    x,
    y,
  });

  return tab;
};

app.whenReady().then(() => {
  mainBaseWindow = new BaseWindow({
    width: 1200,
    height: 700,
    backgroundColor: "#000",
    frame: false,
    roundedCorners: false,
    titleBarStyle: "hidden",
    titleBarOverlay: true,
    titleBarOverlay: {
      color: "#475569",
      symbolColor: "#fff",
      height: 40,
    },
  });

  mainBaseWindow.setBackgroundColor("#000");

  overlayWindow = new WebContentsView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "browserPreload.js"),
    },
  });
  mainBaseWindow.contentView.addChildView(overlayWindow);

  if (isDev) {
    overlayWindow.webContents.loadURL("http://localhost:3000");
  } else {
    overlayWindow.webContents.loadFile(
      path.join(__dirname, "../ui_dist/index.html")
    );
  }

  overlayWindow.setBounds({ ...mainBaseWindow.getBounds(), x: 0, y: 0 });

  mainBaseWindow.on("resize", () => {
    overlayWindow.setBounds({ ...mainBaseWindow.getBounds(), x: 0, y: 0 });
  });

  ipcMain.on("tab:seperator", (event, data) => {
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
    }

    event.sender.send("fromMain", "Hello from Main");
  });

  // overlayWindow.webContents.openDevTools();

  const showTabs = true;

  if (showTabs) {
    tab1 = createTab({
      url: "https://rakibtg.com",
      x: 200,
      y: 40,
      width: 296,
      height: 540,
    });

    tab2 = createTab({
      url: "https://duck.com/",
      x: 504,
      y: 40,
      width: 296,
      height: 540,
    });
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
