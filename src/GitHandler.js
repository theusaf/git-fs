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
  fetchChanges: async (git,repo,passcb)=>{
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    return new Promise((res,rej)=>{
      if(!fs.existsSync(path.join(__dirname,"../data/repos/",repo))){
        return rej(repo);
      }
      const fetcher = spawn(git || "git",["fetch"],{cwd: repoPath});
      fetcher.stderr.on("data",err=>{
        rej(err);
      });
      fetcher.on("close",()=>{
        // checkout files, search for changes.
        let inf = [];
        let toDate = false;
        const changes = spawn(git || "git",["checkout"],{cwd: repoPath});
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
              const commit = spawn(git || "git",["commit","-am","Commit new changes"],{cwd: repoPath});
              commit.on("close",()=>{
                // push.
                module.exports.uploadChanges(git,repo,passcb).then(()=>{
                  res("updated");
                }).catch(err=>{
                  rej(err);
                });
              });
            }else{
              res("updated");
            }
          }else{
            // "pull" - checks out all changed files, removes them and 'hides' them
            for(let news of inf){
              await module.exports.loadFile(git,repo,news).then(()=>{
                await module.exports.hideFile(git,repo,news);
              });
            }
          }
        });
      });
      fetcher.on("error",error=>{
        rej(error);
      });
    });
  },
  loadFile: (git,repo,file)=>{ // load a single file
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    return new Promise((res,rej)=>{
      const checkout = spawn(git||"git",["checkout",file],{cwd:repoPath});
      checkout.on("close",()=>{
        module.exports.showFile(git,repo,file).then(()=>{
          res();
        }).catch(e=>{
          rej(e);
        });
      });
    });
  },
  uploadChanges: async (git,repo,userin)=>{ // push
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    let username = "";
    let password = "";
    return new Promise((resolve, reject)=>{
      const push = spawn(git||"git",["push"],{cwd:repoPath});
      push.stderr.on("error",error=>{
        reject(error);
      });
      push.stdout.on("data",data=>{
        data = data.toString();
        // if requires password
        if(data.search("Username") == 0){
          const credentials = await userin();
          username = credentials.u;
          password = credentials.p;
          push.stdin.write(username);
        }
        if(data.search("Password") == 0){
          push.stdin.write(password);
        }
      });
      push.on("error",error=>{
        reject(error);
      });
      push.on("close",()=>{
        resolve();
      });
    });
  },
  hideFile: (git,repo,file)=>{ // removes and adds "assume unchanged"
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    return new Promise((res,rej)=>{
      if(fs.existsSync(path.join(repoPath,file))){
        fs.unlink(path.join(repoPath,file),(err)=>{
          if(err){
            return rej(err);;
          }
          // assume unchanged.
          const assumer = spawn(git||"git",["update-index","--assume-unchanged",file],{cwd:repoPath});
          assumer.on("close",()=>{res();});
        });
      }
    });
  },
  showFile: (git,repo,file)=>{ // removes "assume unchanged" status
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    return new Promise((res,rej)=>{
      const unassumer = spawn(git||"git",["update-index","--no-assume-unchanged",file],{cwd:repoPath});
      unassumer.on("close",()=>{res();});
    });
  }
}
