Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj, null, 2))
}
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key))
}

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
        if (key === "username") uniqueUser = checkUsername(userName, value[key]);
        if (key === "email") uniqueEmail = checkEmail(userEmail, value[key]);
        if (key === "password") passwordMatch = checkMatch(userPassword);
      }
    });

    console.log(uniqueUser);
    console.log(uniqueEmail);
    console.log(passwordMatch);
    console.log(agreement);

    function checkUsername(value, usr) {
      if (value === usr) return false;
      return true;
    }

    function checkEmail(value, email) {
      return (value === email) ? false : true;
    }

    function checkMatch(value) {
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

    for (let i = 0; i < storageArray.length; i++) {
      for (let key in storageArray[i]) {
        if (key === "username" || key === "email") {
          usernameExists = checkUsernameExists(userNameOrEmail, storageArray[i][key]) || checkEmailExists(userNameOrEmail, storageArray[i][key]);
          rememberUser = i;
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

    if ( correctPassword && usernameExists ) {
      let headerUser = document.getElementsByClassName('user__name')[0];
      headerUser.textContent = userNameOrEmail;
      localStorage.logged = true;
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

    let userItem = {
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

  function redirect() {
    window.location.replace("account.html");
  }

  return {
    createUser: createUser,
    checkRegister: checkRegister,
    checkLogin: checkLogin,
    redirect: redirect
  };

})();

const loginBtn = document.getElementsByClassName('login__submit')[0];
loginBtn.addEventListener('click', session.checkLogin);
// localStorage.setObj('currentUser', localStorage.getObj('services')[0])
// localStorage.setObj('currentUser', Object.assign(localStorage.getObj('currentUser'), {id: 11}))