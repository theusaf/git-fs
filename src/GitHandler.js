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
  fetchChanges: (git,repo)=>{
    return new Promise((res,rej)=>{
      if(!fs.existsSync(path.join(__dirname,"../data/repos/",repo))){
        return rej(repo);
      }
      const fetcher = spawn(git || "git",["fetch"],{
        cwd: path.join(__dirname,"../data/repos/",repo)
      });
      fetcher.stderr.on("data",err=>{
        rej(err);
      });
      fetcher.on("close",()=>{
        // checkout files, search for changes.
        let inf = [];
        const changes = spawn(git || "git",["checkout"]);
        changes.stderr.on("data",err=>{rej(err)});
        changes.on("error",err=>{rej(err)});
        changes.stdout.on("data",data=>{
          data = data.toString();
          if(data.search){

          }
        });
      });
      fetcher.on("error",error=>{
        rej(error);
      });
    });
  },
  loadFiles: ()=>{

  },
  uploadChanges: (git,repo)=>{

  },
  hideFile: (git,repo,file)=>{

  },
  showFile: (git,repo,file)=>{

  }
}
