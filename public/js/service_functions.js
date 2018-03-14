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
  console.log(plus30days);  
}