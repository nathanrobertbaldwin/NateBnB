const getCurrentDate = () => {
  const date = new Date();
  const now = date.getTime();
  return now;
};

const getDateFromString = (str) => {
  str = str.split("-");
  year = str[0];
  month = str[1] - 1;
  day = str[2];
  const newDate = new Date(year, month, day);
  return newDate.getTime();
};

module.exports = { getCurrentDate, getDateFromString };
