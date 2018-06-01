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

  function setFrom (branch) {
    event.payload.pull_request.head.ref = branch;
  }

  function setTo (branch) {
    event.payload.pull_request.base.ref = branch;
  }

  describe('Auto Merge', () => {
    it('Skip branch merged', async () => {
      event.payload.pull_request.merged = true;

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('Branch not configured', async () => {
      setFrom('epd');
      setTo('master');

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('Match Branch', async () => {
      await robot.receive(payload);

      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        path: '.github/branch.yml'
      });

      expect(github.pullRequests.merge).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        number: 1
      });
    });

    it('Skip with WIP title', async () => {
      event.payload.pull_request.title = '[WIP] Pull 1';

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('Match Branch in list', async () => {
      setFrom('QAS');
      setTo('ppr');
      await robot.receive(event);

      expect(github.pullRequests.merge).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        number: 1
      });
    });

    it('No Match Branch', async () => {
      setFrom('QAS');

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('No Match Branch in list', async () => {
      setFrom('ppr');
      setTo('epd');

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('No Match Branch ppr', async () => {
      setFrom('ppr');
      setTo('QAS');

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });

    it('Not found config file', async () => {
      github.repos.getContent = jest.fn().mockReturnValue(new Promise(() => {
        const error = new Error();
        error.code = 404;

        throw error;
      }));

      await robot.receive(event);

      expect(github.pullRequests.merge).not.toHaveBeenCalled();
    });
  });
});
