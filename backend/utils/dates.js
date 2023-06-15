const getCurrentDate = () => {
  const date = new Date();
  const time = date.getTime();
  console.log(time);
  return date.getTime();
};

const getDateFromString = (str) => {
  console.log(str);
  str = str.split("-");
  year = str[0];
  month = str[1] - 1;
  day = str[2];
  const newDate = new Date(year, month, day);
  const time = newDate.getTime();
  console.log(time);
  return newDate.getTime();
};

module.exports = { getCurrentDate, getDateFromString };
