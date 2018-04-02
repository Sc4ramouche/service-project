let reserveModal = document.getElementsByClassName("reserve__modal")[0];
let reserveButton = document.getElementsByClassName("reserve__button")[0];
let reserveModalClose = document.getElementsByClassName("modal__close")[1];

reserveButton.onclick = function() {
  reserveModal.style.display = "block";
}

reserveModalClose.onclick = function() {
  reserveModal.style.display = "none";
}

window.onclick = function() {
  if (event.target == reserveModal) {
    reserveModal.style.display = "none";  
  }
}