const {spawn} = require("child_process");

module.exports = function(){
  return new Promise((resolve,reject)=>{
    const finder = spawn("git",["--version"]);
    finder.stdout.on("data",err=>{
      reject(err);
    });
    finder.stdout.on("data",data=>{
      if(data.search("git version") == -1){
        reject(data);
      }else{
        resolve();
      }
    });
    finder.on("error",error=>{
      reject(error);
    });
  });
}
