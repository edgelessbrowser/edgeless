import os from "os";
import { nativeTheme } from "electron";

const getOsName = () => {
  switch (os.platform()) {
    case "win32":
      return "Windows";
    case "darwin":
      return "macOS";
    case "linux":
      return "Linux";
    default:
      return "Unknown";
  }
};

const getSystemTheme = () =>
  nativeTheme.shouldUseDarkColors ? "Dark" : "Light";

const getArchitecture = () => {
  switch (os.arch()) {
    case "x64":
      return "x64";
    case "arm64":
      return "arm64";
    case "arm":
      return "arm";
    case "ia32":
      return "x86";
    default:
      return "Unknown";
  }
};

export { getOsName, getSystemTheme, getArchitecture };
