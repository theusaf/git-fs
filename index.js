// Modules
const {spawn,exec} = require("child_process");
const path = require("path");
const fs = require("fs");
const electron = require("electron");

// app modules
const isGitInstalled = require(path.join(__dirname,"src/DetectGit.js"));
const GitHandler = require(path.join(__dirname,"src/GitHandler.js"));
const options = JSON.parse(fs.readFileSync(path.join(__dirname,"data/options.json"),"utf8"));

// Detect Stuff
isGitInstalled(options.git).then(res=>{
  // Git is installed. Continue loading
  startupLoad();
}).catch(err=>{
  console.log("git not installed: " + err);
  // Git is not installed
  startupExit("Git is not installed.");
});

function startupExit(reason){
}
function startupLoad(){
  electron.app.whenReady().then(()=>{
    const window = new electron.BrowserWindow({
      width: 1280,
      height: 800
    });
    window.loadFile(path.join(__dirname,"screens/loading.html"));
  });
}
