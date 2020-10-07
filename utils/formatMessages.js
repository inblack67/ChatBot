const moment = require('moment');

exports.formatMessage = (username, text) => {
  return {
    username,
    text,
    date: moment().format('h:mm:a'),
  };
};
