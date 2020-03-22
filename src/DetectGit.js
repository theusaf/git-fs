const {spawn} = require("child_process");

module.exports = function(git){
  return new Promise((resolve,reject)=>{
    const finder = spawn(git || "git",["--version"]);
    finder.stderr.on("data",err=>{
      console.log("Error found #1");
      reject(err);
    });
    finder.stdout.on("data",data=>{
      data = data.toString();
      if(data.search(/git version/mg) === -1){
        console.log("Error found #2");
        reject(data);
      }else{
        resolve(data);
      }
    });
    finder.on("error",error=>{
      console.log("Error found #3");
      reject(error);
    });
  });
}
