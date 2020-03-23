const fs = require('fs');
const path = require('path');
module.exports = function(part){
  return new Promise((res,rej)=>{
    fs.readFile(path.join(__dirname,"../../screens/parts",part + ".html"),'utf8',(err,html)=>{
      res(html);
    });
  });
}
