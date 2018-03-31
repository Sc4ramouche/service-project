function transformDateForInput(date) {
  let year = date.getFullYear();

  let month = date.getMonth() + 1;
  if (month < 10) month = '0' + month;

  let day = date.getDate();
  if (day < 10) day = '0' + day;

  return year + '-' + month + '-' + day + '';
}

function add30Days(date) {
  let plus30days = new Date(date.setDate(date.getDate() + 30));
}

function checkPhoneNumber(number) {
  let myRe = /^\d\s[\(]\d{3}[\)]\s\d{3}[\-]\d{2}[\-]\d{2}$/;

  return myRe.test(number);
}

function writeServiceToTable(date, service, index) {
  let whichTable = '';

  if (new Date(date) < new Date()) {
    table = document.getElementsByClassName('previous__table')[0];
    whichTable = 'previous';
  } else {
    table = document.getElementsByClassName('upcoming__table')[0];
    whichTable = 'upcoming';
  }

  let row = table.insertRow(1);
  let dateCell = row.insertCell(0);
  let serviceCell = row.insertCell(1);

  dateCell.innerHTML = date;
  serviceCell.innerHTML = service;
  row.setAttribute("index", index);

  if (whichTable === 'upcoming') {
    let cancelCell = row.insertCell(2);
    cancelCell.innerHTML = `<button type="button" class="cancel__button login__button--usual" id="${index}" onClick="session.cancelUpcomingVisits(this.id)">Cancel</button>`;
    table.style.display = "block";
  }

  if (whichTable === 'previous') {
    table.style.display = "block";
  }

  dateCell.classList.add("table__cell");
  serviceCell.classList.add("table__cell");
}

function checkExistingServices() {
  const tablePrevious = document.getElementsByClassName('previous__table')[0];
  const tableUpcoming = document.getElementsByClassName('upcoming__table')[0];

  disableTableIfEmpty(tablePrevious);
  disableTableIfEmpty(tableUpcoming);
}

function disableTableIfEmpty(table) {
  if (table.getElementsByTagName("tr").length < 2) {
    table.style.display = "none";
    if (table.classList.contains("upcoming__table")) {
      document.getElementsByClassName("heading__upcoming")[0].style.display = "none";
    } else {
      document.getElementsByClassName("heading__previous")[0].style.display = "none";
    }
  }
}

function writeDataToEnsureModal(cancelButtonId) {
  const cancelMessage = document.getElementsByClassName("ensure__message")[0];
  tableRow = getRowToProcess(cancelButtonId);

  const date = tableRow.childNodes[0].innerHTML;
  const service = tableRow.childNodes[1].innerHTML;

  cancelMessage.innerHTML = `Are you sure you want to cancel ${service} service at ${date}?`;
}

function removeFromLocalStorage(row) {
  const users = JSON.parse(localStorage.users);
  const id = localStorage.currentUserId;

  const date = row.childNodes[0].innerHTML;
  const service = row.childNodes[1].innerHTML;

  users[id].services.forEach((value, index) => {
    if (value.service == service && value.date == date) {
      users[id].services.splice(index, 1);
    }
  });

  localStorage.setObj('users', users);
}

function hideTableIfLeftEmpty() {
  const table = document.getElementsByClassName("upcoming__table")[0];

  console.log( table.rows.length );

  if (table.rows.length < 2) table.style.display = "none";
}

function createTestUsers() {

  const fakeUsers = [
    {
      username: "kristine",
      email: "Kristie1992@fake.com",
      password: "qwerty",
      phone: "9 (333) 111-22-33",
      services: [
        {
          service: "Massage",
          date: "2018-02-14"
        },
        {
          service: "Makeup & Waxing",
          date: "2018-03-18"
        }
      ]
    },
    {
      username: "cutiegirl",
      email: "dramaqueen@fake.com",
      password: "shinyone",
      phone: "9 (555) 666-78-12",
      services: [
        {
          service: "Body Treatments",
          date: "2018-02-16"
        },
        {
          service: "Makeup & Waxing",
          date: "2018-03-20"
        },
        {
          service: "Facials",
          date: "2018-04-15"
        },
        {
          service: "Massage",
          date: "2018-04-06"
        }
      ]
    },
    {
      username: "adam",
      email: "coolguy@fake.com",
      password: "skull",
      phone: "9 (577) 126-76-34",
      services: [
        {
          service: "Facials",
          date: "2018-02-16"
        },
        {
          service: "Massage",
          date: "2018-04-13"
        }
      ]
    }
  ]

  if (localStorage.users === undefined) {
    localStorage.users = "";
    let temp = JSON.parse('[' + localStorage.users + ']');

    fakeUsers.forEach((value) => {
      temp.push(value);
    });

    localStorage.setObj('users', temp);
  } else {
    let temp = JSON.parse(localStorage.users);

    fakeUsers.forEach((value) => {
      temp.push(value);
    });

    localStorage.setObj('users', temp);
  }
}

function getRowToProcess(id) {
  const tableRows = document.querySelectorAll('tr');
  let rightTableRow;

  for (let i = 0; i < tableRows.length; i++) {
    if (tableRows[i].getAttribute("index") === id) {
      //  tableRows[i].parentNode.removeChild(tableRows[i]);
      rightTableRow = tableRows[i];
    }
  }

  return rightTableRow;
}

function responsive() {
  let x = document.getElementsByClassName("nav__list")[0];
  if (x.classList.contains("nav__list")) {
    x.classList.toggle("responsive");
  }
}