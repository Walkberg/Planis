import { app, BrowserWindow } from "electron";
import * as path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV === "development";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // En développement, charge l'URL du serveur Vite
  // En production, charge le fichier HTML buildé
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173").catch((err) => {
      console.error("Failed to load URL:", err);
    });
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow
      .loadFile(path.join(__dirname, "../renderer/dist/index.html"))
      .catch((err) => {
        console.error("Failed to load file:", err);
      });
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
