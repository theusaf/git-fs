module.exports = function(){
  const {QProgressBar, QLabel, FlexLayout, QWidget, QMainWindow, QIcon, QMessageBox, ButtonRole, QPushButton} = require("@nodegui/nodegui");
  const path = require("path");
  const fs = require("fs");

  const icon = new QIcon(path.join(__dirname,"data/image/icon.png"));
  const document = new QWidget();
  const label = new QLabel();
  const progress = new QProgressBar();
  const win = new QMainWindow();
  // Setup
  document.setLayout(new FlexLayout());
  document.setObjectName("rootView");
  // Create two widgets - one label and one view
  label.setText("Loading...");
  label.setObjectName("LoadingText");
  progress.setObjectName("LoadingBar");
  // Now tell rootView layout that the label and the other view are its children
  document.layout.addWidget(label);
  document.layout.addWidget(progress);
  // Tell FlexLayout how you want children of rootView to be poisitioned
  document.setStyleSheet(fs.readFileSync(path.join(__dirname,"../index.css"),"utf8"));
  win.setWindowIcon(icon);
  win.setCentralWidget(document);
  win.show();
  win.resize(1280,800);
  document.resize(1280,800);
  win.center();
  return [win,progress]
}
