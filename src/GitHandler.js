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
      const fetcher = spawn(git || "git",["fetch"],{cwd: path.join(__dirname,"../data/repos/",repo)});
      fetcher.stderr.on("data",err=>{
        rej(err);
      });
      fetcher.on("close",()=>{
        // checkout files, search for changes.
        let inf = [];
        let toDate = false;
        const changes = spawn(git || "git",["checkout"],{cwd: path.join(__dirname,"../data/repos/",repo)});
        changes.stderr.on("data",err=>{rej(err)});
        changes.on("error",err=>{rej(err)});
        changes.stdout.on("data",data=>{
          data = data.toString();
          if(data.search("up to date with") != -1 && data[0].search(/[adm]/i) == -1){
            toDate = true;
          }else if(data[0].search(/[adm]/i) != -1){
            inf.push(data.split("	")[1]);
          }else if(data.search("is behind") != -1){
            toDate = false;
          }
        });
        changes.on("close",()=>{
          if(toDate){
            // commit any changes
            if(inf.length){

            }else{
              res("updated");
            }
          }else{
            // pull
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
