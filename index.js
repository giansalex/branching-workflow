/* eslint-disable semi */
const pull = require('./src/pull_request');

module.exports = (robot) => {
  // Your code here
  robot.log('Yay, the app was loaded!');
  robot.on('pull_request.opened', pull);
  robot.on('pull_request.edited', pull);
};
