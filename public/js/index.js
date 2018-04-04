// setup events on buttons
document.getElementsByClassName('login__submit')[0].addEventListener('click', session.checkLogin);
document.getElementsByClassName('register__submit')[0].addEventListener('click', session.checkRegister);

// modal window
const loginModal = document.getElementsByClassName("header__modal")[0];
const loginButton = document.getElementsByClassName("login__button")[0];
const modalClose = document.getElementsByClassName("modal__close")[0];
const promoBtn = document.getElementsByClassName("promo__button")[0];

promoBtn.onclick = function () {
  loginModal.style.display = "block";
  document.getElementsByTagName("body")[0].style.position = "fixed";
  document.getElementsByClassName("login__email")[0].focus();
};

loginButton.onclick = function () {
  loginModal.style.display = "block";
  document.getElementsByTagName("body")[0].style.position = "fixed";
  document.getElementsByClassName("login__email")[0].focus();
};

modalClose.onclick = function () {
  loginModal.style.display = "none";
  document.getElementsByTagName("body")[0].style.position = "static";
};

window.onclick = function () {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
    document.getElementsByTagName("body")[0].style.position = "static";
  }
};

document.getElementById("defaultOpen").click();