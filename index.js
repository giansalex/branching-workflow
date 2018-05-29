/* eslint-disable semi */
const handlePull = require('./src/pull_request');

module.exports = (robot) => {
  const app = robot.route('/home');

  robot.log('Yay, the app was loaded!');
  robot.on('pull_request.opened', handlePull);

  app.get('/check', (req, res) => {
    res.end('Hi, active!')
  });
};
