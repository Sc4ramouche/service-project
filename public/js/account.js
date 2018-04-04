// setup Reservation and delete visit buttons
document.getElementsByClassName('remove__button')[0].addEventListener('click', session.removeUpcomingService);
document.getElementsByClassName('make-reservation__button')[0].addEventListener('click', session.makeReservation);

session.setInputDate();
session.showInitialVisits();

if (localStorage.logged === "") {
  window.location.replace("index.html");
}

// modal windows
document.getElementsByClassName("reserve__button")[0].onclick = function () {
  document.getElementsByClassName("reserve__modal")[0].style.display = "block";
  document.getElementsByTagName("body")[0].style.position = "fixed";
};

document.getElementsByClassName("modal__close")[0].onclick = function () {
  document.getElementsByClassName("reserve__modal")[0].style.display = "none";
  document.getElementsByTagName("body")[0].style.position = "static";
};

window.onclick = function () {
  if (event.target == document.getElementsByClassName("reserve__modal")[0]) {
    document.getElementsByClassName("reserve__modal")[0].style.display = "none";
    document.getElementsByTagName("body")[0].style.position = "static";
  }
};