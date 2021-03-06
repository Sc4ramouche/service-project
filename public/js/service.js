// setting up more comfortable work with localStorage
Storage.prototype.setObj = function defineSet(key, obj) {
  return this.setItem(key, JSON.stringify(obj, null, 2));
};
Storage.prototype.getObj = function defineGet(key) {
  return JSON.parse(this.getItem(key));
};

const service = (function createServiceFunctions() {

  function transformDateForInput(date) {
    const year = date.getFullYear();

    let month = date.getMonth() + 1;
    if (month < 10) month = '0' + month;

    let day = date.getDate();
    if (day < 10) day = '0' + day;

    return year + '-' + month + '-' + day + '';
  }

  function openTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName('tabs-item');
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    const tablinks = document.getElementsByClassName('tabs__button');
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    document.getElementsByClassName(tabName)[0].style.display = 'block';
    evt.currentTarget.className += ' active';
  }

  function setHeaderUsername() {
    const user = document.getElementsByClassName('header__user')[0];
    const login = document.getElementsByClassName('login__button')[0];
    const userName = document.getElementsByClassName('user__name')[0];

    if (localStorage.logged) {
      user.style.display = 'block';
      login.style.display = 'none';
      userName.textContent = 'Greetings, ' + localStorage.logged[0].toUpperCase() + localStorage.logged.slice(1) + '!';
    } else {
      user.style.display = 'none';
      login.style.display = 'block';
    }
  }

  function signOut() {
    localStorage.logged = '';
    setHeaderUsername();
    window.location.replace('./');
  }

  function checkPhoneNumber(number) {
    const myRe = /^\d\s[(]\d{3}[)]\s\d{3}[-]\d{2}[-]\d{2}$/;

    return myRe.test(number);
  }

  function disableTableIfEmpty(table) {
    if (table.getElementsByTagName('tr').length < 2) {
      table.style.display = 'none';
      if (table.classList.contains('upcoming__table')) {
        document.getElementsByClassName('heading__upcoming')[0].style.display = 'none';
      } else {
        document.getElementsByClassName('heading__previous')[0].style.display = 'none';
      }
    }
  }

  function writeServiceToTable(date, serviceType, index) {
    let whichTable = '';
    let table;

    if ((new Date(date)).getDate() < (new Date()).getDate()) {
      table = document.getElementsByClassName('previous__table')[0];
      whichTable = 'previous';
    } else {
      table = document.getElementsByClassName('upcoming__table')[0];
      whichTable = 'upcoming';
    }

    const row = table.insertRow(1);
    const dateCell = row.insertCell(0);
    const serviceCell = row.insertCell(1);

    dateCell.innerHTML = date;
    serviceCell.innerHTML = serviceType;
    row.setAttribute('index', index);

    if (whichTable === 'upcoming') {
      const cancelCell = row.insertCell(2);
      cancelCell.innerHTML = `<button type='button' class='cancel__button login__button--usual' id='${index}' onClick='session.cancelUpcomingVisits(this.id)'>Cancel</button>`;
      table.style.display = 'table';
    }

    if (whichTable === 'previous') {
      table.style.display = 'table';
    }

    row.classList.add('table__row');
    dateCell.classList.add('table__cell');
    serviceCell.classList.add('table__cell');
  }

  function checkReservationDate(inputDate) {
    const currentDate = new Date();
    let plus30Days = new Date();
    plus30Days.setDate(plus30Days.getDate() + 30);
    const passedDate = new Date(inputDate);

    if (passedDate < currentDate || passedDate > plus30Days) return false;

    return true;
  }

  function checkExistingServices() {
    const tablePrevious = document.getElementsByClassName('previous__table')[0];
    const tableUpcoming = document.getElementsByClassName('upcoming__table')[0];

    disableTableIfEmpty(tablePrevious);
    disableTableIfEmpty(tableUpcoming);
  }

  function getRowToProcess(id) {
    const tableRows = document.querySelectorAll('tr');
    let rightTableRow;

    for (let i = 0; i < tableRows.length; i++) {
      if (tableRows[i].getAttribute('index') === id) {
        //  tableRows[i].parentNode.removeChild(tableRows[i]);
        rightTableRow = tableRows[i];
      }
    }

    return rightTableRow;
  }

  function writeDataToEnsureModal(cancelButtonId) {
    const cancelMessage = document.getElementsByClassName('ensure__message')[0];
    const tableRow = getRowToProcess(cancelButtonId);

    const date = tableRow.childNodes[0].innerHTML;
    const serviceType = tableRow.childNodes[1].innerHTML;

    cancelMessage.innerHTML = `Are you sure you want to cancel ${serviceType} service at ${date}?`;
  }

  function evokeEnsureModal(id) {
    const ensureBtn = document.getElementById(id);
    const modalClose = document.getElementsByClassName('modal__close')[1];
    const ensureModal = document.getElementsByClassName('ensure__modal')[0];
    const leaveButton = document.getElementsByClassName('leave__button')[0];

    ensureModal.setAttribute('cancelid', id);

    modalClose.onclick = function closeModal() {
      ensureModal.style.display = 'none';
    };

    ensureModal.style.display = 'block';

    ensureBtn.onclick = function openModal() {
      ensureModal.style.display = 'block';
    };

    leaveButton.onclick = function closeModal() {
      ensureModal.style.display = 'none';
    };
  }

  function writeUserToLocalStorage(userObject) {
    if (localStorage.users === undefined) {
      localStorage.users = '';
      const temp = JSON.parse('[' + localStorage.users + ']');
      temp.push(userObject);
      localStorage.setObj('users', temp);
    } else {
      const temp = JSON.parse(localStorage.users);
      temp.push(userObject);
      localStorage.setObj('users', temp);
    }
  }

  function writeReservationToLocalStorage(usersArray, userId, phoneNumber, serviceObj) {
    usersArray[userId].phone = phoneNumber;

    if (usersArray[userId].services === undefined) usersArray[userId].services = [];

    usersArray[userId].services.push(serviceObj);
    localStorage.setObj('users', usersArray);
  }

  function removeFromLocalStorage(row) {
    const users = JSON.parse(localStorage.users);
    const id = localStorage.currentUserId;

    const date = row.childNodes[0].innerHTML;
    const serviceType = row.childNodes[1].innerHTML;

    users[id].services.forEach((value, index) => {
      if (value.service === serviceType && value.date === date) {
        users[id].services.splice(index, 1);
      }
    });

    localStorage.setObj('users', users);
  }

  function removeTableRow(tableRow) {
    tableRow.parentNode.removeChild(tableRow);
  }

  function hideTableIfLeftEmpty() {
    const table = document.getElementsByClassName('upcoming__table')[0];

    if (table.rows.length < 2) table.style.display = 'none';
  }

  function checkUsernameErrors(username, uniqueUser) {
    if (username.length < 3) {
      const error = document.getElementsByClassName('register__error-username-short')[0];
      error.style.display = 'inline-block';
    } else if (!uniqueUser) {
      const error = document.getElementsByClassName('register__error-username')[0];
      error.style.display = 'inline-block';
    }
  }

  function checkEmailErrors(email, uniqueEmail) {
    if (email.length < 5) {
      const error = document.getElementsByClassName('register__error-email-short')[0];
      error.style.display = 'inline-block';
    } else if (!uniqueEmail) {
      const error = document.getElementsByClassName('register__error-email')[0];
      error.style.display = 'inline-block';
    }
  }

  function checkPasswordErrors(passwordMatch) {
    if (!passwordMatch) {
      const error = document.getElementsByClassName('register__error-match')[0];
      error.style.display = 'inline-block';
    }
  }

  function checkAgreementErrors(agreement) {
    if (!agreement) {
      const error = document.getElementsByClassName('register__error-agree')[0];
      error.style.display = 'inline-block';
    }
  }

  function removeErrors() {
    const errors = document.getElementsByClassName('error');
    for (let i = 0; i < errors.length; i++) {
      errors[i].style.display = 'none';
    }
  }

  function loggingIn(usernameOrEmail, userId) {
    const headerUser = document.getElementsByClassName('user__name')[0];
    headerUser.textContent = usernameOrEmail;
    localStorage.logged = usernameOrEmail;
    localStorage.currentUserId = userId;
    window.location.href = './account';
  }

  function checkPasswordLength(value) {
    return (value.length > 4);
  }

  function checkUsernameExists(value, usr) {
    return (value === usr);
  }

  function checkEmailExists(value, mail) {
    return (value === mail);
  }

  function checkPassword(value, psw) {
    return (value === psw);
  }

  function checkPasswordMatch(value) {
    const pswMatch = document.getElementsByClassName('register__password-repeat')[0].value;
    if (checkPasswordLength(value)) {
      return (value === pswMatch);
    }
    const error = document.getElementsByClassName('register__error-password')[0];
    error.style.display = 'inline-block';
    return false;
  }

  function checkLoginErrors(usernameExists, usersArray, userId, userPassword, correctPassword) {
    if (usernameExists) {
      correctPassword = checkPassword(usersArray[userId].password, userPassword);
    } else if (!usernameExists) {
      const error = document.getElementsByClassName('login__error-email')[0];
      error.style.display = 'inline-block';
    }

    if (!correctPassword && usernameExists) {
      const error = document.getElementsByClassName('login__error-password')[0];
      error.style.display = 'inline-block';
    }

    return correctPassword;
  }

  function responsive() {
    const x = document.getElementsByClassName('nav__list')[0];
    if (x.classList.contains('nav__list')) {
      x.classList.toggle('responsive');
    }
  }

  function createTestUsers() {
    const fakeUsers = [
      {
        username: 'kristine',
        email: 'Kristie1992@fake.com',
        password: 'qwerty',
        phone: '9 (333) 111-22-33',
        services: [
          {
            service: 'Massage',
            date: '2018-02-14',
          },
          {
            service: 'Makeup & Waxing',
            date: '2018-03-18',
          },
        ],
      },
      {
        username: 'cutiegirl',
        email: 'dramaqueen@fake.com',
        password: 'shinyone',
        phone: '9 (555) 666-78-12',
        services: [
          {
            service: 'Body Treatments',
            date: '2018-02-16',
          },
          {
            service: 'Makeup & Waxing',
            date: '2018-03-20',
          },
          {
            service: 'Facials',
            date: '2018-04-15',
          },
          {
            service: 'Massage',
            date: '2018-04-06',
          },
        ],
      },
      {
        username: 'adam',
        email: 'coolguy@fake.com',
        password: 'skull',
        phone: '9 (577) 126-76-34',
        services: [
          {
            service: 'Facials',
            date: '2018-02-16',
          },
          {
            service: 'Massage',
            date: '2018-04-13',
          },
        ],
      },
    ];

    if (localStorage.users === undefined) {
      localStorage.users = '';
      const temp = JSON.parse('[' + localStorage.users + ']');

      fakeUsers.forEach((value) => {
        temp.push(value);
      });

      localStorage.setObj('users', temp);
    } else {
      const temp = JSON.parse(localStorage.users);

      fakeUsers.forEach((value) => {
        temp.push(value);
      });

      localStorage.setObj('users', temp);
    }
  }

  return {
    transformDateForInput,
    openTab,
    signOut,
    setHeaderUsername,
    checkPhoneNumber,
    writeServiceToTable,
    checkExistingServices,
    disableTableIfEmpty,
    writeDataToEnsureModal,
    evokeEnsureModal,
    writeUserToLocalStorage,
    writeReservationToLocalStorage,
    removeFromLocalStorage,
    removeTableRow,
    hideTableIfLeftEmpty,
    checkUsernameErrors,
    checkEmailErrors,
    checkPasswordErrors,
    checkAgreementErrors,
    removeErrors,
    checkPasswordMatch,
    checkLoginErrors,
    loggingIn,
    checkPasswordLength,
    checkUsernameExists,
    checkEmailExists,
    checkPassword,
    getRowToProcess,
    responsive,
    createTestUsers,
    checkReservationDate,
  };
})();
