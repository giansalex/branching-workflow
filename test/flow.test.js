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
      pullRequests: {
        update: jest.fn()
      },
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

  function setFrom (branch) {
    event.payload.pull_request.head.ref = branch;
  }

  function setTo (branch) {
    event.payload.pull_request.base.ref = branch;
  }

  describe('Restrict', () => {
    it('Not configured', async () => {
      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('Match Branch', async () => {
      setFrom('ppr');
      setTo('master');

      await robot.receive(event);

      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        path: '.github/branch.yml'
      });

      expect(github.repos.createStatus).not.toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('Match Branch in list', async () => {
      setFrom('bpt');
      setTo('qas');

      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('No Match Branch', async () => {
      setFrom('qas');
      setTo('master');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('No Match Branch in list', async () => {
      setFrom('soporte');
      setTo('qas');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('Match Branch and close', async () => {
      setFrom('epd');
      setTo('ppr');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        number: 1,
        state: 'closed'
      });
    });
  });
});
