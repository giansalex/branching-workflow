/* eslint-disable semi */
const payload = require('./events/pull_request.opened');
const {createRobot} = require('probot');
const app = require('../index');

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
    it('Match Branch', async () => {
      // Simulates delivery of a payload
      // payload.event is the X-GitHub-Event header sent by GitHub (for example "push")
      // payload.payload is the actual payload body
      await robot.receive(payload);
      // This test would pass if in your main code you called `context.github.issues.createComment`
      expect(github.pullRequests.merged).toHaveReturnedWith({merged: true})
    })
  })
})
