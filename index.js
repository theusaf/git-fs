// Modules
const {spawn,exec} = require("child_process");
const path = require("path");
const fs = require("fs");
const electron = require("electron");

// app modules
const isGitInstalled = require(path.join(__dirname,"src/DetectGit.js"));
const GitHandler = require(path.join(__dirname,"src/GitHandler.js"));
const options = JSON.parse(fs.readFileSync(path.join(__dirname,"data/options.json"),"utf8"));
const ipc = electron.ipcMain;
const isMac = process.platform == "darwin";

electron.app.whenReady().then(()=>{
  startupLoad();
});
function startupLoad(){
  if(isMac){
    const image = electron.nativeImage.createFromPath(path.join(__dirname,"data/image/icon.png"));
    electron.app.dock.setIcon(image);
  }
  const window = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(__dirname,"data/images/icon.png"),
    title: "Git File System - Startup",
    webPreferences: {
      preload: path.join(__dirname,"src/js/renderer.js")
    }
  });
  window.loadFile(path.join(__dirname,"screens/loading.html"));
}

electron.app.on("window-all-closed", function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (!isMac) {
    app.quit();
  }
})

electron.app.on("activate", function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    startupLoad();
  }
});
