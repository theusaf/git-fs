const _ = require("@nodegui/nodegui");
const fs = require("fs");
const path = require("path");
module.exports = function(win,screens,parts){
  const layout = new _.QBoxLayout(0);
  const doc = new _.QWidget();
  doc.setObjectName("mainView");
  win.setCentralWidget(doc);
  const sidebarDiv = new _.QScrollArea();
  const sidebarLayout = new _.QBoxLayout(2);
  const mainDiv = new _.QScrollArea();
  sidebarDiv.setLayout(sidebarLayout);
  doc.setLayout(layout);
  doc.layout.addWidget(sidebarDiv);
  doc.layout.addWidget(mainDiv);
  sidebarDiv.setObjectName("sidebar");
  mainDiv.setObjectName("main");
  doc.setObjectName("document");
  doc.setStyleSheet(fs.readFileSync(path.join(__dirname,"../styles/main.css"),"utf8"));
  const sideHeader = new _.QLabel();
  sideHeader.setText("Files");
  sideHeader.setAlignment(132);
  sidebarDiv.layout.addWidget(sideHeader);
  sideHeader.setObjectName("LayoutHeading");
  const fsdflex = new _.FlexLayout();
  const fileShowDiv = new _.QWidget();
  fileShowDiv.setObjectName("SidebarFiles");
  fileShowDiv.setLayout(fsdflex);
  sidebarDiv.layout.addWidget(fileShowDiv);

  // debugging
  setInterval(function(){
    doc.setStyleSheet(fs.readFileSync(path.join(__dirname,"../styles/main.css"),"utf8"));
  },3000);

};
