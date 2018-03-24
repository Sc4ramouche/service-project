/*eslint wrap-iife: false*/
const session = (function createSession() {

  function removeErrors() {
    const errors = document.getElementsByClassName('error');
    for (let i = 0; i < errors.length; i++) {
      errors[i].style.display = "none";
    };
  }

  // Private check register function 
  function checkRegister() {
    removeErrors();

    const storageArray = JSON.parse(localStorage.users);

    const userName = document.getElementsByClassName('register__username')[0].value.toLowerCase();
    const userEmail = document.getElementsByClassName('register__email')[0].value.toLowerCase();
    const userPassword = document.getElementsByClassName('register__password')[0].value;

    let uniqueUser = true;
    let uniqueEmail = true;
    let passwordMatch = false;
    let agreement = document.getElementsByClassName('register__agree')[0].checked;

    storageArray.forEach((value, index) => {
      for (let key in value) {

        if (key === "username") {
          let alreadyMet = (userName === value[key]) ? true : false;
          if (alreadyMet === true) uniqueUser = false;
        }
        if (key === "email") {
          let alreadyMet = (userEmail === value[key]) ? true : false;
          if (alreadyMet === true) uniqueEmail = false;
        }
        if (key === "password") passwordMatch = checkPasswordMatch(userPassword);
        // if (key === "username") uniqueUser = (userName === value[key]) ? false : true;
        // if (key === "email") uniqueEmail = (userEmail === value[key]) ? false : true;
        // if (key === "password") passwordMatch = checkPasswordMatch(userPassword);
      }
    });

    if (!uniqueUser) {
      const error = document.getElementsByClassName('register__error-username')[0];
      error.style.display = "inline-block";
    }

    if (uniqueUser &&
      uniqueEmail &&
      passwordMatch &&
      agreement) session.createUser();

    function checkPasswordMatch(value) {
      let pswMatch = document.getElementsByClassName('register__password-repeat')[0].value;
      if ( checkPasswordLength(value) ) {
        return (value === pswMatch) ? true : false
      } else {
        const error = document.getElementsByClassName('register__error-username')[0];
        error.style.display = "inline-block";
      }       
    }

    function checkPasswordLength(value) {
      return (value.length > 4) ? true : false;
    }
  }

  // private check login function
  function checkLogin() {

    removeErrors();

    const storageArray = JSON.parse(localStorage.users);

    const userNameOrEmail = document.getElementsByClassName('login__email')[0].value.toLowerCase();
    const userPassword = document.getElementsByClassName('login__password')[0].value.toLowerCase();

    let usernameExists = false;
    let correctPassword = false;
    let rememberUser = 0;

    check:
    for (let userId = 0; userId < storageArray.length; userId++) {
      for (let key in storageArray[userId]) {
        if (key === "username" || key === "email") {
          usernameExists = checkUsernameExists(userNameOrEmail, storageArray[userId][key]) || checkEmailExists(userNameOrEmail, storageArray[userId][key]);
          rememberUser = userId;
          if (usernameExists) break check;
        }
      }
    }

    if (usernameExists) {
      correctPassword = checkPassword(storageArray[rememberUser].password, userPassword);
    }

    if (!usernameExists) {
      const error = document.getElementsByClassName('login__error-email')[0];
      error.style.display = "inline-block";
    }

    if (!correctPassword && usernameExists) {
      const error = document.getElementsByClassName('login__error-password')[0];
      error.style.display = "inline-block";
    }

    if (correctPassword && usernameExists) {
      let headerUser = document.getElementsByClassName('user__name')[0];
      headerUser.textContent = userNameOrEmail;
      localStorage.logged = userNameOrEmail;
      localStorage.currentUserId = rememberUser;
      window.location.href = "account.html";
    }

    // Serving functions
    function checkUsernameExists(value, usr) {
      return (value === usr) ? true : false;
    }

    function checkEmailExists(value, mail) {
      return (value === mail) ? true : false;
    }

    function checkPassword(value, psw) {
      return (value === psw) ? true : false;
    }

    function errorUser() {
      return usernameExist ? true : false;
    }

    function errorPassword() {
      return correctPassword ? true : false;
    }
  }

  // private create user function
  function createUser() {
    let userName = document.getElementsByClassName('register__username')[0].value.toLowerCase();
    let userEmail = document.getElementsByClassName('register__email')[0].value.toLowerCase();
    let userPassword = document.getElementsByClassName('register__password')[0].value;

    const userItem = {
      username: userName,
      email: userEmail,
      password: userPassword
    };

    if (localStorage.users === undefined) {
      localStorage.users = "";
      let temp = JSON.parse('[' + localStorage.users + ']');
      temp.push(userItem);
      localStorage.setObj('users', temp);
    } else {
      let temp = JSON.parse(localStorage.users);
      temp.push(userItem);
      localStorage.setObj('users', temp);
    }

    localStorage.logged = userName;
    localStorage.currentUserId = JSON.parse(localStorage.users).length - 1;
    redirect();
    setHeaderUsername();
  }

  function makeReservation() {
    let currentId = localStorage.currentUserId;

    let chosenService = document.getElementsByClassName('reserve__service')[0].value;
    let chosenDate = document.getElementsByClassName('reserve__date')[0].value;
    let phoneNumber = document.getElementsByClassName('reserve__phone')[0].value;

    let users = JSON.parse(localStorage.users);
    let id = localStorage.currentUserId;

    if (checkPhoneNumber(phoneNumber) && chosenDate !== '') {

      let serviceItem = {
        service: chosenService,
        date: chosenDate,
      };

      users[id].phone = phoneNumber;

      if (users[id].services === undefined) users[id].services = [];

      users[id].services.push(serviceItem);
      localStorage.setObj("users", users);
    }

    session.updateUpcomingVisits();
  }

  function updateUpcomingVisits() {
    let users = JSON.parse(localStorage.users);
    let currentUser = users[localStorage.currentUserId];

    if (currentUser.services !== undefined) {
      let tableDate = currentUser.services[currentUser.services.length - 1].date;
      let tableService = currentUser.services[currentUser.services.length - 1].service;

      writeServiceToTable(tableDate, tableService);
    };

    // if (currentUser.services !== undefined) {
    //   currentUser.services.forEach((value) => {
    //     let tableDate = value.date;
    //     let tableService = value.service;

    //     writeServiceToTable(tableDate, tableService);
    //   });
    // }

    checkExistingServices();
  }

  function showInitialVisits() {
    let users = JSON.parse(localStorage.users);
    let currentUser = users[localStorage.currentUserId];

    if (currentUser.services !== undefined) {
      currentUser.services.forEach((value) => {
        let tableDate = value.date;
        let tableService = value.service;

        writeServiceToTable(tableDate, tableService);
      });
    }

    checkExistingServices();
  }

  function cancelUpcomingVisits() {
    let users = JSON.parse(localStorage.users);
    let currentUser = users[localStorage.currentUserId];

    const row = reference.parentNode;
    console.log(row);
  }

  function setInputDate() {
    let inputDate = document.getElementsByClassName('reserve__date')[0];
    let currentDate = new Date();
    let plus30Days = new Date(currentDate.setDate(currentDate.getDate() + 30));
    // let maxDate = transformDateForInput(new Date());
    inputDate.setAttribute('min', String(transformDateForInput(new Date())));
    inputDate.setAttribute('max', String(transformDateForInput(plus30Days)));
  }

  function redirect() {
    window.location.replace("account.html");
  }

  return {
    createUser: createUser,
    checkRegister: checkRegister,
    checkLogin: checkLogin,
    redirect: redirect,
    setInputDate: setInputDate,
    makeReservation: makeReservation,
    updateUpcomingVisits: updateUpcomingVisits,
    showInitialVisits: showInitialVisits
  };

})();

const loginBtn = document.getElementsByClassName('login__submit')[0];
loginBtn.addEventListener('click', session.checkLogin);

const registerBtn = document.getElementsByClassName('register__submit')[0];
registerBtn.addEventListener('click', session.checkRegister);

session.setInputDate();
session.showInitialVisits();

