let loginModal = document.getElementsByClassName("header__modal")[0];
let loginButton = document.getElementsByClassName("login__button")[0];
let modalClose = document.getElementsByClassName("modal__close")[0];

loginButton.onclick = function() {
  loginModal.style.display = "block";
}

modalClose.onclick = function() {
  loginModal.style.display = "none";
}

window.onclick = function() {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
}