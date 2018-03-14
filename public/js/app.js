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
    const storageArray = JSON.parse(localStorage.users);

    const userName = document.getElementsByClassName('register__username')[0].value;
    const userEmail = document.getElementsByClassName('register__email')[0].value;
    const userPassword = document.getElementsByClassName('register__password')[0].value;

    let uniqueUser = true;
    let uniqueEmail = true;
    let passwordMatch = false;
    let agreement = document.getElementsByClassName('register__agree')[0].checked;

    storageArray.forEach((value, index) => {
      for (let key in value) {
        if (key === "username") uniqueUser = (userName === value[key]) ? false : true;
        if (key === "email") uniqueEmail = (userEmail === value[key]) ? false : true;
        if (key === "password") passwordMatch = checkPasswordMatch(userPassword);
      }
    });

    console.log(uniqueUser);
    console.log(uniqueEmail);
    console.log(passwordMatch);
    console.log(agreement);

    function checkPasswordMatch(value) {
      let pswMatch = document.getElementsByClassName('register__password-repeat')[0].value;
      return (value === pswMatch) ? true : false;
    }
  }

  // private check login function
  function checkLogin() {

    removeErrors();

    const storageArray = JSON.parse(localStorage.users);

    const userNameOrEmail = document.getElementsByClassName('login__email')[0].value;
    const userPassword = document.getElementsByClassName('login__password')[0].value;

    let usernameExists = false;
    let correctPassword = false;
    let rememberUser = 0;

    for (let userId = 0; userId < storageArray.length; userId++) {
      for (let key in storageArray[userId]) {
        if (key === "username" || key === "email") {
          usernameExists = checkUsernameExists(userNameOrEmail, storageArray[userId][key]) || checkEmailExists(userNameOrEmail, storageArray[userId][key]);
          rememberUser = userId;
          if (usernameExists) break;
        }
      }
    }

    if (usernameExists) {
      correctPassword = checkPassword(storageArray[rememberUser].password, userPassword);
    }

    console.log(usernameExists);
    console.log(correctPassword);

    if (!usernameExists) {
      const error = document.getElementsByClassName('login__error-email')[0];
      error.style.display = "inline-block";
    }

    if (!correctPassword && usernameExists) {
      const error = document.getElementsByClassName('login__error-password')[0];
      error.style.display = "inline-block";
    }

    if (correctPassword && usernameExists ) {
      let headerUser = document.getElementsByClassName('user__name')[0];
      headerUser.textContent = userNameOrEmail;
      localStorage.logged = userNameOrEmail;
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
    let userName = document.getElementsByClassName('register__username')[0].value;
    let userEmail = document.getElementsByClassName('register__email')[0].value;
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
  }

  function makeReservation() {

  }

  function setInputDate() {
    let inputDate = document.getElementsByClassName('reserve__date')[0];
    let currentDate = new Date();
    let plus30Days = new Date(currentDate.setDate(currentDate.getDate() + 30));
    // let maxDate = transformDateForInput(new Date());
    inputDate.setAttribute('min', String( transformDateForInput(new Date()) ));
    inputDate.setAttribute('max', String( transformDateForInput(plus30Days)));
  }

  function redirect() {
    window.location.replace("account.html");
  }

  return {
    createUser: createUser,
    checkRegister: checkRegister,
    checkLogin: checkLogin,
    redirect: redirect,
    setInputDate: setInputDate
  };

})();

const loginBtn = document.getElementsByClassName('login__submit')[0];
loginBtn.addEventListener('click', session.checkLogin);

session.setInputDate();

