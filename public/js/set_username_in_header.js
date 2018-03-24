function setHeaderUsername() {
  let user = document.getElementsByClassName('header__user')[0];
  let login = document.getElementsByClassName('login__button')[0];
  let userName = document.getElementsByClassName('user__name')[0];
  if ( localStorage.logged ) {
    user.style.display = "block";
    login.style.display = "none";
    userName.textContent = "Greetings, " + localStorage.logged[0].toUpperCase() + localStorage.logged.slice(1) + "!";
  } else {
    user.style.display = "none";
    login.style.display = "block";
  }
}

setHeaderUsername();

function signOut() { 
  localStorage.logged = "";
  setHeaderUsername();
  console.log('l');
  window.location.replace("index.html");
}

let signOff = document.getElementsByClassName('sign-out__button')[0];
signOff.addEventListener('click', signOut);