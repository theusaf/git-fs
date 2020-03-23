const resizeBar = document.getElementById("drag-resize");
const sidebar = document.getElementById("sidebar");
const content = document.getElementById("main");
let mouseInfo;
let resizeInterval;
resizeBar.addEventListener("mousedown",function(evt){
  evt.preventDefault();
  resizeInterval = setInterval(handleResize);
});
window.addEventListener("mouseup",function(){
  clearInterval(resizeInterval);
});
window.addEventListener("mousemove",function(evt){
  mouseInfo = {
    x: evt.pageX,
    y: evt.pageY
  };
});
function handleResize(){
  const win = {
    width: window.innerWidth,
    height: window.innerHeight
  };
  // calculate percents
  const mainPercent = (win.width - mouseInfo.x) / win.width;
  const sidebarPercent = (win.width - (win.width - mouseInfo.x)) / win.width;
  sidebar.style.flex = sidebarPercent * 100 + "%";
  content.style.flex = mainPercent * 100 + "%";
}
