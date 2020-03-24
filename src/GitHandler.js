const fs = require("fs");
const path = require("path");
const {spawn} = require("child_process");
module.exports = {
  getRepos: ()=>{
    console.log("getting repos from filesystem");
    return new Promise((res,rej)=>{
      fs.readdir(path.join(__dirname,"../data/repos"),{withFileTypes:true},(err,files)=>{
        if(err){
          rej(err);
        }
        try{
          const dirs = Array.from(files).filter(item=>{
            return item.isDirectory() && fs.existsSync(path.join(__dirname,"../data/repos",item.name,".git"));
          });
          res(dirs);
        }catch(err){
          res([]);
        }
      });
    });
  },
  fetchChanges: (git,repo,passcb,pull)=>{
    console.log("fetching new changes");
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    return new Promise((res,rej)=>{
      if(!fs.existsSync(path.join(__dirname,"../data/repos/",repo))){
        return rej(repo);
      }
      const fetcher = spawn(git || "git",["fetch"],{cwd: repoPath});
      fetcher.stderr.on("data",err=>{
        err=err.toString();
        rej(err);
      });
      fetcher.on("close",()=>{
        // checkout files, search for changes.
        let inf = [];
        let toDate = true;
        const changes = spawn(git || "git",[...((!pull && ["checkout"]) || ["pull","origin","master"])],{cwd: repoPath});
        changes.stderr.on("data",err=>{if(!pull){}err=err.toString();rej(err)});
        changes.on("error",err=>{err=err.toString();rej(err)});
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
        changes.on("close",async ()=>{
          if(pull){
            toDate = true;
            inf = [];
          }
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
              await module.exports.loadFile(git,repo,news).then(async ()=>{
                await module.exports.hideFile(git,repo,news);
              });
            }
          }
        });
      });
      fetcher.on("error",error=>{
        error = error.toString();
        rej(error);
      });
    });
  },
  loadFile: (git,repo,file)=>{ // load a single file
    console.log("loading files");
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
    console.log("uploading changes");
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    let username = "";
    let password = "";
    return new Promise((resolve, reject)=>{
      const push = spawn(git||"git",["push"],{cwd:repoPath});
      push.stderr.on("error",error=>{
        error=error.toString();
        reject(error);
      });
      push.stdout.on("data",async data=>{
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
    console.log("hiding files");
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    if(fs.existsSync(path.join(repoPath,file)) && fs.lstatSync(path.join(repoPath,file)).isDirectory()){
      return new Promise(function(resolve, reject) {
        fs.readdir(path.join(repoPath,file),async (err,files)=>{
          if(err){
            reject(err);
          }
          for(let file2 of files){
            await module.exports.hideFile(git,repo,path.join(file,file2));
          }
          resolve();
        });
      });;
    }
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
    console.log("showing files");
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    return new Promise((res,rej)=>{
      const unassumer = spawn(git||"git",["update-index","--no-assume-unchanged",file],{cwd:repoPath});
      unassumer.on("close",()=>{res();});
    });
  },
  initiateRepo: (git,repo,remote,passcb)=>{
    const repoPath = path.join(__dirname,"../data/repos/",repo);
    return new Promise((res,rej)=>{
      if(fs.existsSync(repoPath)){
        rej("repo already exists");
      }
      fs.mkdir(repoPath,()=>{
        const initiator = spawn(git||"git",["init"],{cwd: repoPath});
        initiator.on("close",()=>{
          const remoter = spawn(git||"git",["remote","add","origin",remote],{cwd: repoPath});
          remoter.on("close",()=>{
            module.exports.fetchChanges(git,repo,passcb,true).then(()=>{
              res();
            }).catch(e=>{
              rej(e);
            });
          });
          remoter.on("error",err=>{
            err=err.toString();
            rej(err);
          });
        });
      });
    });
  }
}
