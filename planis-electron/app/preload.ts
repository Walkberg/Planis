import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electronAPI", {
  // Add any API methods you need to expose to the renderer process here
  // For example:
  // getVersion: () => process.versions.electron,
  // platform: process.platform,
});
