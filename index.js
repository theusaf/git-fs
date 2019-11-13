if(!process.versions.qode){
  throw "Err! Started using node, please use npm start instead";
}

// Modules
const {spawn,exec} = require("child_process");
const path = require("path");
const fs = require("fs");
const {QProgressBar, QLabel, FlexLayout, QWidget, QMainWindow} = require("@nodegui/nodegui");
const isGitInstalled = require(path.join(__dirname,"src/DetectGit.js"));
const GitHandler = require(path.join(__dirname,"src/GitHandler.js"));

// Setup
const document = new QWidget();
document.setLayout(new FlexLayout());
document.setObjectName("rootView");
// Create two widgets - one label and one view
const label = new QLabel();
label.setText("Loading");
label.setObjectName("label");
const view = new QProgressBar();
view.setObjectName("view");
// Now tell rootView layout that the label and the other view are its children
document.layout.addWidget(label);
document.layout.addWidget(view);
// Tell FlexLayout how you want children of rootView to be poisitioned
document.setStyleSheet(fs.readFileSync(path.join(__dirname,"index.css"),"utf8"));
const win = new QMainWindow();
win.setCentralWidget(document);
win.show();
global.win = win;
