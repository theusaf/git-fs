const _ = require("@nodegui/nodegui");
module.exports = function(win){
  const layout = new _.FlexLayout();
  const doc = new _.QWidget();
  doc.setObjectName("mainView");
  win.setCentralWidget(doc);
}
