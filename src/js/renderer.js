const ipc = require("electron").ipcRenderer;
const fs = require("fs");
const path = require("path");

const isGitInstalled = require(path.join(__dirname,"../DetectGit.js"));
const GitHandler = require(path.join(__dirname,"../GitHandler.js"));
const options = JSON.parse(fs.readFileSync(path.join(__dirname,"../../data/options.json"),"utf8"));
const loadPart = require(path.join(__dirname,"parts.js"));

/* Load Stages:
1. check for git.
*/
window.addEventListener('load',()=>{
  const loadText = document.getElementById("loading-inf");
  const pageid = document.querySelector('[name="gitfs-screen-id"]');
  if(pageid.content == "load"){
    window.ipc = ipc;
    const loadBar = document.getElementById("loading-prg");
    const int = (loadBar.style.width.match(/\d+/gm) && loadBar.style.width.match(/\d+/gm)) || 0;
    // Detect Stuff
    isGitInstalled(options.git).then(res=>{
      loadBar.style.width = (int + 100) + "%";
      loadText.innerHTML = "Done!";
      window.location = "main.html";
    }).catch(err=>{
      loadText.className = "error";
      loadText.innerHTML = "git not found. Redirecting to git website. Restart this app when git is installed.";
      setTimeout(()=>{
        window.location = "https://git-scm.com/downloads";
      },3000);
    });
  }else if(pageid.content == "main"){
    const frame = document.getElementById("mainscreen");
    GitHandler.getRepos().then(async repos=>{
      if(repos.length && !options.repository){
        // select repo
        frame.innerHTML = await loadPart("select-repo");
        require(path.join(__dirname,"../../data/parts/js/select.js"))();
      }else if(repos.length && options.repository){
        // load repo
        frame.innerHTML = await loadPart("load-repo");
        require(path.join(__dirname,"../../data/parts/js/load.js"))();
      }else{
        // create new repo
        frame.innerHTML = await loadPart("gen-repo");
        require(path.join(__dirname,"../../data/parts/js/gen.js"))();
      }
    });
    function createRepo(){
      delete window.createRepo;
      const name = document.getElementById("RepoName").value;
      const url = document.getElementById("RepoURL").value;
      let buffering = true;
      GitHandler.initiateRepo(options.git,name,url).then(()=>{
        buffering = false;
      });
      loadPart("buffer").then(html=>{
        if(!buffering){
          return;
        }
        frame.innerHTML = html;
      });
    }
    window.createRepo = createRepo;
  }
});
