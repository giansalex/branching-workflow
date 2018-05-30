/* eslint-disable semi */
const payload = require('./events/pull_request.opened');
const { createRobot } = require('probot');
const app = require('../index');
const fs = require('fs');

describe('Branch Workflow', () => {
  let robot;
  let github;
  let event;

  beforeEach(() => {
    event = JSON.parse(JSON.stringify(payload));
    // Here we create a robot instance
    robot = createRobot();
    // Here we initialize the app on the robot instance
    app(robot);
    // This is an easy way to mock out the GitHub API
    github = {
      repos: {
        createStatus: jest.fn(),
        getContent: jest.fn().mockReturnValue(Promise.resolve({
          data: {
            content: fs.readFileSync('./test/config/restrict.yml').toString('base64')
          }
        }))
      }
    };
    // Passes the mocked out GitHub API into out robot instance
    robot.auth = () => Promise.resolve(github)
  });

  describe('Restrict', () => {
    it('Not configured', async () => {
      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
    });

    it('Match Branch', async () => {
      event.payload.pull_request.base.ref = 'master';
      event.payload.pull_request.head.ref = 'ppr';

      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
    });

    it('Match Branch in list', async () => {
      event.payload.pull_request.base.ref = 'qas';
      event.payload.pull_request.head.ref = 'BPT';

      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
    });

    it('No Match Branch', async () => {
      event.payload.pull_request.base.ref = 'master';
      event.payload.pull_request.head.ref = 'qas';

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
    });

    it('No Match Branch in list', async () => {
      event.payload.pull_request.base.ref = 'qas';
      event.payload.pull_request.head.ref = 'soporte';

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
    });
  });
});
