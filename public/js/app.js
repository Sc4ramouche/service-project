const session = (function createSession() {
  function checkRegister() {
    service.removeErrors();

    const users = localStorage.getObj('users');
    const userName = document.getElementsByClassName('register__username')[0].value.toLowerCase();
    const userEmail = document.getElementsByClassName('register__email')[0].value.toLowerCase();
    const userPassword = document.getElementsByClassName('register__password')[0].value;

    let uniqueUser = true;
    let uniqueEmail = true;
    let passwordMatch = false;
    const agreement = document.getElementsByClassName('register__agree')[0].checked;

    if (users !== null) {
      users.forEach((value) => {
        const keys = Object.keys(value);
        for (let i = 0; i < keys.length; i++) {
          if (keys[i] === 'username' && value[keys[i]] === userName) uniqueUser = false;
          if (keys[i] === 'email' && value[keys[i]] === userEmail) uniqueEmail = false;
          if (keys[i] === 'password') passwordMatch = service.checkPasswordMatch(userPassword);
        }
      });
    } else {
      passwordMatch = service.checkPasswordMatch(userPassword);
    }

    service.checkUsernameErrors(userName, uniqueUser);
    service.checkEmailErrors(userEmail, uniqueEmail);
    service.checkPasswordErrors(passwordMatch);
    service.checkAgreementErrors(agreement);

    if (uniqueUser && uniqueEmail && passwordMatch && agreement) session.createUser();
  }

  function checkLogin() {
    service.removeErrors();

    const users = localStorage.getObj('users');
    const userNameOrEmail = document.getElementsByClassName('login__email')[0].value.toLowerCase();
    const userPassword = document.getElementsByClassName('login__password')[0].value.toLowerCase();
    let username = '';

    let usernameExists = false;
    let correctPassword = false;
    let rememberUser = 0;

    if (users !== null) {
      for (let userId = 0; userId < users.length; userId++) {
        if (users[userId].username.toLowerCase() === userNameOrEmail
          || users[userId].email.toLowerCase() === userNameOrEmail) {
          usernameExists = true;
          rememberUser = userId;
          username = users[userId].username;
          break;
        }
      }
    }

    correctPassword = service.checkLoginErrors(usernameExists, users, rememberUser, userPassword, correctPassword);
    if (correctPassword && usernameExists) service.loggingIn(username, rememberUser);
  }

  function createUser() {
    const userName = document.getElementsByClassName('register__username')[0].value.toLowerCase();
    const userEmail = document.getElementsByClassName('register__email')[0].value.toLowerCase();
    const userPassword = document.getElementsByClassName('register__password')[0].value;

    const userItem = {
      username: userName,
      email: userEmail,
      password: userPassword,
    };

    service.writeUserToLocalStorage(userItem);

    localStorage.logged = userName;
    localStorage.currentUserId = JSON.parse(localStorage.users).length - 1;
    window.location.replace('./account');
    service.setHeaderUsername();
  }

  function makeReservation() {
    const phoneNumber = document.getElementsByClassName('reserve__phone')[0].value;
    const users = localStorage.getObj('users');
    const id = localStorage.currentUserId;

    const serviceItem = {
      service: document.getElementsByClassName('reserve__service')[0].value,
      date: document.getElementsByClassName('reserve__date')[0].value,
    };

    if (service.checkPhoneNumber(phoneNumber) && serviceItem.date !== '') {
      service.writeReservationToLocalStorage(users, id, phoneNumber, serviceItem);
      session.updateUpcomingVisits();

      document.getElementsByClassName('reserve__modal')[0].style.display = 'none';
      document.getElementsByTagName('body')[0].style.position = 'static';
    } else {
      document.getElementsByClassName('reserve__fill-error')[0].style.display = 'block';
    }
  }

  function updateUpcomingVisits() {
    const users = localStorage.getObj('users');
    const currentUser = users[localStorage.currentUserId];

    if (currentUser.services !== undefined) {
      const tableDate = currentUser.services[currentUser.services.length - 1].date;
      const tableService = currentUser.services[currentUser.services.length - 1].service;

      service.writeServiceToTable(tableDate, tableService);
    }

    service.checkExistingServices();
  }

  function showInitialVisits() {
    const users = localStorage.getObj('users');

    if (users !== null) {
      const currentUser = users[localStorage.currentUserId];
      if (currentUser.services !== undefined) {
        currentUser.services.forEach((value, index) => {
          const tableDate = value.date;
          const tableService = value.service;

          service.writeServiceToTable(tableDate, tableService, index);
        });
      }
    }

    service.checkExistingServices();
  }

  function cancelUpcomingVisits(cancelButtonId) {
    service.writeDataToEnsureModal(cancelButtonId);
    service.evokeEnsureModal(cancelButtonId);
  }

  function removeUpcomingService() {
    const ensureModal = document.getElementsByClassName('ensure__modal')[0];

    const tableRow = service.getRowToProcess(ensureModal.getAttribute('cancelid'));

    service.removeTableRow(tableRow);
    service.removeFromLocalStorage(tableRow);
    document.getElementsByClassName('ensure__modal')[0].style.display = 'none';
    service.hideTableIfLeftEmpty();
  }

  function setInputDate() {
    const inputDate = document.getElementsByClassName('reserve__date')[0];
    const currentDate = new Date();
    const plus30Days = new Date(currentDate.setDate(currentDate.getDate() + 30));

    inputDate.setAttribute('min', String(service.transformDateForInput(new Date())));
    inputDate.setAttribute('max', String(service.transformDateForInput(plus30Days)));
  }

  return {
    createUser,
    checkRegister,
    checkLogin,
    setInputDate,
    makeReservation,
    updateUpcomingVisits,
    showInitialVisits,
    cancelUpcomingVisits,
    removeUpcomingService,
  };
})();

const signOff = document.getElementsByClassName('sign-out__button')[0];
signOff.addEventListener('click', service.signOut);

service.setHeaderUsername();
