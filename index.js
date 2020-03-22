if(!process.versions.qode){
  throw "Err! Started using node, please use npm start instead";
}

// Modules
const {spawn,exec} = require("child_process");
const path = require("path");
const fs = require("fs");
const {QProgressBar, QLabel, FlexLayout, QWidget, QMainWindow, QIcon, QMessageBox, ButtonRole, QPushButton} = require("@nodegui/nodegui");

// app modules
const isGitInstalled = require(path.join(__dirname,"src/DetectGit.js"));
const GitHandler = require(path.join(__dirname,"src/GitHandler.js"));
const options = JSON.parse(fs.readFileSync(path.join(__dirname,"data/options.json"),"utf8"));
const screens = require(path.join(__dirname,"screens.js"));

const __ = screens.load();

global.win = __[0];
const progress = __[1];

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
  const m = new QMessageBox();
  m.setText("Error: " + reason);
  const ok = new QPushButton();
  ok.setText("ok");
  m.addButton(ok,ButtonRole.AcceptRole);
  m.exec();
  process.exit(0);
}
function startupLoad(){
  progress.setValue(100);
  screens.main(win,screens);
}
