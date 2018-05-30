/* eslint-disable semi */
const payload = require('./events/pull_request.opened');
const { createRobot } = require('probot');
const app = require('../index');
const fs = require('fs');

describe('Branching Workflow', () => {
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
      pullRequests: {
        merge: jest.fn()
      },
      repos: {
        getContent: jest.fn().mockReturnValue(Promise.resolve({
          data: {
            content: fs.readFileSync('./test/config/automerge.yml').toString('base64')
          }
        }))
      }
    };
    // Passes the mocked out GitHub API into out robot instance
    robot.auth = () => Promise.resolve(github)
  });

  describe('Auto Merge', () => {
    it('Not configured', async () => {
      event.payload.pull_request.head.ref = 'epd';
      event.payload.pull_request.base.ref = 'master';

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('Match Branch', async () => {
      await robot.receive(payload);

      expect(github.pullRequests.merge).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        number: 1
      });
    });

    it('Match Branch in list', async () => {
      event.payload.pull_request.head.ref = 'ppr';
      event.payload.pull_request.base.ref = 'qas';
      await robot.receive(payload);

      expect(github.pullRequests.merge).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        number: 1
      });
    });

    it('No Match Branch', async () => {
      event.payload.pull_request.head.ref = 'QAS';

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('No Match Branch in list', async () => {
      event.payload.pull_request.head.ref = 'ppr';
      event.payload.pull_request.base.ref = 'epd';

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });
  });
});
