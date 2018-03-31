const loginModal = document.getElementsByClassName("header__modal")[0];
const loginButton = document.getElementsByClassName("login__button")[0];
const modalClose = document.getElementsByClassName("modal__close")[0];
const promoBtn = document.getElementsByClassName("promo__button")[0];

promoBtn.onclick = function () {
  loginModal.style.display = "block";
};

loginButton.onclick = function () {
  loginModal.style.display = "block";
};

modalClose.onclick = function () {
  loginModal.style.display = "none";
};

window.onclick = function () {
  if (event.target == loginModal) {
    loginModal.style.display = "none";
  }
};

function evokeEnsureModal(id) {
  const ensureBtn = document.getElementById(id);
  const modalClose = document.getElementsByClassName("modal__close")[2];
  const ensureModal = document.getElementsByClassName("ensure__modal")[0];
  const leaveButton = document.getElementsByClassName("leave__button")[0];

  ensureModal.setAttribute("cancelid", id);

  modalClose.onclick = function () {
    ensureModal.style.display = "none";
  };

  ensureModal.style.display = "block";

  ensureBtn.onclick = function () {
    ensureModal.style.display = "block";
  }

  leaveButton.onclick = function () {
    ensureModal.style.display = "none";
  }
}