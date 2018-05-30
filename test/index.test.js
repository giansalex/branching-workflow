/* eslint-disable semi */
const {createRobot} = require('probot');
const app = require('../index');
const branch = require('../src/branch');

describe('branch-workflow', () => {
  let robot;
  let github;

  beforeEach(() => {
    // Here we create a robot instance
    robot = createRobot();
    // Here we initialize the app on the robot instance
    app(robot);
    // This is an easy way to mock out the GitHub API
    github = {
      issues: {
        createComment: jest.fn().mockReturnValue(Promise.resolve({
          // Whatever the GitHub API should return
        }))
      },
      pullRequests: {
        merge: jest.fn().mockReturnValue(Promise.resolve({
          merged: true
        }))
      }
    };
    // Passes the mocked out GitHub API into out robot instance
    robot.auth = () => Promise.resolve(github)
  })

  describe('Auto Merge', () => {
    // it('Match Branch', async () => {
      // Simulates delivery of a payload
      // payload.event is the X-GitHub-Event header sent by GitHub (for example "push")
      // payload.payload is the actual payload body
      // await robot.receive(payload);
      // This test would pass if in your main code you called `context.github.issues.createComment`
    //   expect(github.pullRequests.merge).toHaveReturnedWith({merged: true})
    // })

    it('Valid Branch Name', () => {
      const pullRequest = {
        base: {
          ref: 'EPD'
        },
        head: {
          ref: 'EPD'
        }
      };
      const automerge = [
        {
          target: 'EPD',
          source: 'EPD'
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeTruthy();
    })

    it('Invalid Branch Name', () => {
      const pullRequest = {
        base: {
          ref: 'EPD'
        },
        head: {
          ref: 'QAS'
        }
      };
      const automerge = [
        {
          target: 'EPD',
          source: 'EPD'
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeFalsy();
    })

    it('Valid Branch in List names', () => {
      const pullRequest = {
        base: {
          ref: 'EPD'
        },
        head: {
          ref: 'EPD'
        }
      };
      const automerge = [
        {
          target: 'EPD',
          source: ['EPD', 'DEV']
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeTruthy();
    })

    it('Invalid Branch in List names', () => {
      const pullRequest = {
        base: {
          ref: 'EPD'
        },
        head: {
          ref: 'PPR'
        }
      };
      const automerge = [
        {
          target: 'EPD',
          source: ['EPD', 'DEV']
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeFalsy();
    })
  })
})
