let loginModal = document.getElementsByClassName("header__modal")[0];
let loginButton = document.getElementsByClassName("login__button")[0];
let modalClose = document.getElementsByClassName("modal__close")[0];
let promoBtn = document.getElementsByClassName("promo__button")[0];

promoBtn.onclick = function() {
  loginModal.style.display = "block";
};

loginButton.onclick = function() {
  loginModal.style.display = "block";
};

modalClose.onclick = function() {
  loginModal.style.display = "none";
};

window.onclick = function() {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
};