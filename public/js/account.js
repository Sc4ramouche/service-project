const removeBtn = document.getElementsByClassName('remove__button')[0];
removeBtn.addEventListener('click', session.removeUpcomingService);

const makeReservationBtn = document.getElementsByClassName('make-reservation__button')[0];
makeReservationBtn.addEventListener('click', session.makeReservation);

session.setInputDate();
session.showInitialVisits();