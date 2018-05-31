/* eslint-disable semi */
const handlePull = require('./src/pull_request');

module.exports = (robot) => {
  robot.log('The app was loaded!');
  robot.on('pull_request.opened', handlePull);
};
