// setup Reservation and delete visit buttons
document.getElementsByClassName('remove__button')[0].addEventListener('click', session.removeUpcomingService);
document.getElementsByClassName('make-reservation__button')[0].addEventListener('click', session.makeReservation);

session.setInputDate();
session.showInitialVisits();

if (localStorage.logged === '' || localStorage.logged === undefined) {
  window.location.replace('../');
}

// modal windows
document.getElementsByClassName('reserve__button')[0].onclick = function openModal() {
  document.getElementsByClassName('reserve__modal')[0].style.display = 'block';
  document.getElementsByTagName('body')[0].style.position = 'fixed';
  document.getElementsByClassName('reserve__date')[0].focus();
};

document.getElementsByClassName('modal__close')[0].onclick = function closeModalCharacter() {
  document.getElementsByClassName('reserve__modal')[0].style.display = 'none';
  document.getElementsByClassName('reserve__fill-error')[0].style.display = 'none';
  document.getElementsByTagName('body')[0].style.position = 'static';
};

window.onclick = function closeModal(evt) {
  if (!evt) evt = window.event;
  if (evt.target === document.getElementsByClassName('reserve__modal')[0]) {
    document.getElementsByClassName('reserve__modal')[0].style.display = 'none';
    document.getElementsByClassName('reserve__fill-error')[0].style.display = 'none';
    document.getElementsByTagName('body')[0].style.position = 'static';
  }
};
