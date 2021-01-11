/* eslint-disable import/no-unresolved */
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
dayjs.extend(require('dayjs/plugin/duration'));

const FORMAT_DATE = 'YYYY-MM-DD';
const FORMAT_TIME = 'HH:mm:ss';
const FORMAT_DATETIME = 'YYYY-MM-DD HH:mm:ss';

function checkValidTimeFormat(timeString) {
  const tempDateTime = `${dayjs().format(FORMAT_DATE)} ${timeString}`;
  return dayjs(tempDateTime, FORMAT_DATETIME, true).isValid();
}

module.exports = {
  dayjs,
  FORMAT_TIME,
  FORMAT_DATETIME,
  FORMAT_DATE,
  checkValidDateTimeFormat: (dateTimeString) =>
    dayjs(dateTimeString, FORMAT_DATETIME, true).isValid(),
  checkValidDateFormat: (dateString) =>
    dayjs(dateString, FORMAT_DATE, true).isValid(),
  checkValidTimeFormat,
  getTimeDifference: (dateTimeFrom, dateTimeTo) =>
    dayjs.duration(dayjs(dateTimeFrom).diff(dayjs(dateTimeTo))).asMinutes(),
  getDateDifference: (dateTimeFrom, dateTimeTo) =>
    dayjs.duration(dayjs(dateTimeFrom).diff(dayjs(dateTimeTo))).asDays(),
};
