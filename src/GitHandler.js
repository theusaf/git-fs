const fs = require("fs");
const path = require("path");
const {spawn} = require("child_process");
module.exports = {
  getRepos: ()=>{
    return new Promise((res,rej)=>{
      fs.readdir(path.join(__dirname,"../data/repos"),{withFileTypes:true},files=>{
        try{
          const dirs = Array.from(files).filter(item=>{
            return item.isDirectory();
          });
          console.log(dirs);
          res(dirs);
        }catch(err){
          res([]);
        }
      });
    });
  },
  fetchChanges: git=>{

  },
  uploadChanges: git=>{

  },
  hideFile: (git,file)=>{

  },
  showFile: (git,file)=>{

  }
}
