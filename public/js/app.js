/*eslint wrap-iife: false*/
const session = (function createSession() {

  function checkRegister() {
    service.removeErrors();

    const storageArray = localStorage.getObj('users');
    const userName = document.getElementsByClassName('register__username')[0].value.toLowerCase();
    const userEmail = document.getElementsByClassName('register__email')[0].value.toLowerCase();
    const userPassword = document.getElementsByClassName('register__password')[0].value;

    let uniqueUser = true;
    let uniqueEmail = true;
    let passwordMatch = false;
    let agreement = document.getElementsByClassName('register__agree')[0].checked;

    storageArray.forEach((value, index) => {
      for (let key in value) {
        if (key === "username" && value[key] === userName) uniqueUser = false;
        if (key === "email" && userEmail === value[key]) uniqueEmail = false;
        if (key === "password") passwordMatch = service.checkPasswordMatch(userPassword);
      }
    });

    service.checkUsernameErrors(userName, uniqueUser);
    service.checkEmailErrors(userEmail, uniqueEmail);
    service.checkPasswordErrors(passwordMatch);
    service.checkAgreementErrors(agreement);

    if (uniqueUser && uniqueEmail && passwordMatch && agreement) session.createUser();
  }

  function checkLogin() {
    service.removeErrors();

    const storageArray = localStorage.getObj('users');
    const userNameOrEmail = document.getElementsByClassName('login__email')[0].value.toLowerCase();
    const userPassword = document.getElementsByClassName('login__password')[0].value.toLowerCase();

    let usernameExists = false;
    let correctPassword = false;
    let rememberUser = 0;

    check:
    for (let userId = 0; userId < storageArray.length; userId++) {
      for (let key in storageArray[userId]) {
        if (key === "username" || key === "email") {
          usernameExists = service.checkUsernameExists(userNameOrEmail, storageArray[userId][key]) 
                        || service.checkEmailExists(userNameOrEmail, storageArray[userId][key]);
          rememberUser = userId;
          if (usernameExists) break check;
        }
      }
    }

    correctPassword = service.checkLoginErrors(usernameExists, storageArray, rememberUser, userPassword, correctPassword);
    if (correctPassword && usernameExists) service.loggingIn(userNameOrEmail, rememberUser);
  }

  function createUser() {
    let userName = document.getElementsByClassName('register__username')[0].value.toLowerCase();
    let userEmail = document.getElementsByClassName('register__email')[0].value.toLowerCase();
    let userPassword = document.getElementsByClassName('register__password')[0].value;

    const userItem = {
      username: userName,
      email: userEmail,
      password: userPassword
    };

    service.writeUserToLocalStorage(userItem);

    localStorage.logged = userName;
    localStorage.currentUserId = JSON.parse(localStorage.users).length - 1;
    redirect();
    service.setHeaderUsername();
  }

  function makeReservation() {
    const phoneNumber = document.getElementsByClassName('reserve__phone')[0].value;
    const users = localStorage.getObj('users');
    const id = localStorage.currentUserId;

    const serviceItem = {
      service: document.getElementsByClassName('reserve__service')[0].value,
      date: document.getElementsByClassName('reserve__date')[0].value
    };

    if (service.checkPhoneNumber(phoneNumber) && serviceItem.date !== '') {
      service.writeReservationToLocalStorage(users, id, phoneNumber, serviceItem);
    }

    session.updateUpcomingVisits();
    document.getElementsByClassName('reserve__modal')[0].style.display = "none";
  }

  function updateUpcomingVisits() {
    let users = JSON.parse(localStorage.users);
    let currentUser = users[localStorage.currentUserId];

    if (currentUser.services !== undefined) {
      let tableDate = currentUser.services[currentUser.services.length - 1].date;
      let tableService = currentUser.services[currentUser.services.length - 1].service;

      service.writeServiceToTable(tableDate, tableService);
    };

    service.checkExistingServices();
  }

  function showInitialVisits() {
    let users = JSON.parse(localStorage.users);
    let currentUser = users[localStorage.currentUserId];

    if (currentUser.services !== undefined) {
      currentUser.services.forEach((value, index) => {
        let tableDate = value.date;
        let tableService = value.service;

        service.writeServiceToTable(tableDate, tableService, index);
      });
    }

    service.checkExistingServices();
  }

  function cancelUpcomingVisits(cancelButtonId) {
    const tableRow = service.getRowToProcess(cancelButtonId);

    service.writeDataToEnsureModal(cancelButtonId);

    service.evokeEnsureModal(cancelButtonId);
  }

  function removeUpcomingService() {
    const ensureModal = document.getElementsByClassName("ensure__modal")[0];

    const tableRow = service.getRowToProcess(ensureModal.getAttribute("cancelid"));

    service.removeTableRow(tableRow);
    service.removeFromLocalStorage(tableRow);
    document.getElementsByClassName("ensure__modal")[0].style.display = "none";
    service.hideTableIfLeftEmpty();
  }

  function setInputDate() {
    let inputDate = document.getElementsByClassName('reserve__date')[0];
    let currentDate = new Date();
    let plus30Days = new Date(currentDate.setDate(currentDate.getDate() + 30));
    // let maxDate = transformDateForInput(new Date());
    inputDate.setAttribute('min', String(service.transformDateForInput(new Date())));
    inputDate.setAttribute('max', String(service.transformDateForInput(plus30Days)));
  }

  function redirect() {
    window.location.replace("account.html");
  }

  return {
    createUser,
    checkRegister,
    checkLogin,
    redirect,
    setInputDate,
    makeReservation,
    updateUpcomingVisits,
    showInitialVisits,
    cancelUpcomingVisits,
    removeUpcomingService
  };

})();

const loginBtnSubmit = document.getElementsByClassName('login__submit')[0];
loginBtnSubmit.addEventListener('click', session.checkLogin);

const registerBtn = document.getElementsByClassName('register__submit')[0];
registerBtn.addEventListener('click', session.checkRegister);

const removeBtn = document.getElementsByClassName('remove__button')[0];
removeBtn.addEventListener('click', session.removeUpcomingService);

const makeReservationBtn = document.getElementsByClassName('make-reservation__button')[0];
makeReservationBtn.addEventListener('click', session.makeReservation);

let signOff = document.getElementsByClassName('sign-out__button')[0];
signOff.addEventListener('click', signOut);

session.setInputDate();
session.showInitialVisits();

setHeaderUsername();
