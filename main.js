console.log("🟢 main.js is running");

const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
  const preloadPath = path.resolve(__dirname, "preload.js");
  console.log("📦 Preload Path:", preloadPath); // 👈 Add this

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
     preload: path.resolve(__dirname, "preload.js"),
  contextIsolation: true,
  nodeIntegration: false,
  nodeIntegrationInWorker: true, // 👈 Add this
    },
  });

  // win.loadFile(path.join(__dirname, "client/dist/index.html"));
  win.loadURL("http://localhost:5173");

}

app.whenReady().then(createWindow);
