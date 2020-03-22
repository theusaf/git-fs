const path = require("path");
module.exports = {
  load: require(path.join(__dirname,"screens/load.js")),
  main: require(path.join(__dirname,"screens/main.js"))
};
