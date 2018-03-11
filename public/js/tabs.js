function openTab(evt, tabName) {
  let tabcontent, tablinks;

  tabcontent = document.getElementsByClassName("tabs-item");
  for (let i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";  
  }

  tablinks = document.getElementsByClassName("tabs__button");
  for (let i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementsByClassName(tabName)[0].style.display = "block";
  evt.currentTarget.className += " active";
}