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
    fork(false);
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

  function from (branch) {
    event.payload.pull_request.head.ref = branch;
  }

  function to (branch) {
    event.payload.pull_request.base.ref = branch;
  }

  function fork (isFork) {
    event.payload.pull_request.head.repo.fork = isFork;
  }

  describe('Restrict', () => {
    it('Not configured', async () => {
      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('Match Branch', async () => {
      from('ppr');
      to('master');

      await robot.receive(event);

      expect(github.repos.getContent).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        path: '.github/branch.yml'
      });

      expect(github.repos.createStatus).not.toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('Match Branch in list - epd', async () => {
      from('epd');
      to('qas');

      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('Match Branch in list - bpt', async () => {
      from('bpt');
      to('qas');

      await robot.receive(event);

      expect(github.repos.createStatus).not.toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('No Match Branch', async () => {
      from('qas');
      to('master');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('No Match Branch in list', async () => {
      from('soporte');
      to('qas');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalled();
    });

    it('Match Branch and close', async () => {
      from('epd');
      to('ppr');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        number: 1,
        state: 'closed'
      });
    });

    it('Fork Match Branch and close', async () => {
      fork(true);
      from('qas');
      to('ppr');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).toHaveBeenCalledWith({
        owner: 'giansalex',
        repo: 'portal',
        number: 1,
        state: 'closed'
      });
    });

    it('Fork Match Branch master and close', async () => {
      fork(true);
      from('ppr');
      to('master');

      await robot.receive(event);

      expect(github.repos.createStatus).toHaveBeenCalled();
      expect(github.pullRequests.update).not.toHaveBeenCalledWith();
    });
  });
});
