const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/customParseFormat'));
dayjs.extend(require('dayjs/plugin/duration'));

const timeFormatRegularExpression = /(2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/g;

module.exports = {
  dayjs,
  FORMAT_TIME: 'hh:mm:ss',
  FORMAT_DATETIME: 'YYYY-MM-DD HH:mm:ss',
  FORMAT_DATE: 'YYYY-MM-DD',
  checkValidDateTimeFormat: (dateTimeString) =>
    dayjs(dateTimeString, this.DATETIME).isValid(),
  checkValidTimeFormat: (timeString) =>
    timeFormatRegularExpression.test(timeString),
  getTimeDifference: (dateTimeFrom, dateTimeTo) =>
    dayjs.duration(dateTimeFrom.diff(dateTimeTo)).asMinutes(),
};
