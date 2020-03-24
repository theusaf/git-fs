module.exports = ()=>{
  const name = document.getElementById("RepoName");
  const template = document.createElement("template");
  template.innerHTML = `<h1>Enter Repository URL</h1>
  <input type="text" id="RepoURL" class="repo" placeholder="https://example.com/user/repo.git">`;
  let done = 0;
  name.addEventListener("change",()=>{
    setTimeout(()=>{
      if(done){
        return;
      }
      done = 1;
      name.parentElement.append(template.content.cloneNode(true));
      executeNext();
    },200);
  });

  function executeNext(){
    const url = document.getElementById("RepoURL");
    url.addEventListener("change",()=>{
      setTimeout(()=>{
        if(done == 2){
          return;
        }
        done = 2;
        const button = document.createElement("button");
        button.id = "RepoSubmitNew";
        button.className = "repo";
        button.type = "submit";
        button.innerHTML = "Create";
        url.parentElement.append(document.createElement("br"),button);
      },200);
    });
  }
};
