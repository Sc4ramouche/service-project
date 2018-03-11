Storage.prototype.setObj = function(key, obj) {
  return this.setItem(key, JSON.stringify(obj, null, 2))
}
Storage.prototype.getObj = function(key) {
  return JSON.parse(this.getItem(key))
}

const session = (function createSession() {
  let users = [];

  function createUser() {
    let userName = document.getElementsByClassName('register__username')[0].value;
    let userEmail = document.getElementsByClassName('register__email')[0].value;
    let userPassword = document.getElementsByClassName('register__password')[0].value;

    let userItem =  {
        username: userName, 
        email: userEmail,
        password: userPassword
      };

    users.push(userItem);  

    localStorage.setObj('users', users);
  }

  return {
    createUser: createUser
  }
})();


localStorage.setObj('currentUser', localStorage.getObj('services')[0])
localStorage.setObj('currentUser', Object.assign(localStorage.getObj('currentUser'), {id: 11}))