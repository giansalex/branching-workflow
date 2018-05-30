/* eslint-disable semi */
const event = require('./events/pull_request.opened');
const { payload } = event;
const branch = require('../src/branch');

describe('Branch Workflow', () => {
  describe('Checker', () => {
    it('Valid Branch Name', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'EPD';
      const automerge = [
        {
          target: 'EPD',
          source: 'EPD'
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeTruthy();
    });

    it('Invalid Branch Name', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'QAS';

      const automerge = [
        {
          target: 'EPD',
          source: 'EPD'
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeFalsy();
    });

    it('Valid Branch in List names', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'EPD';
      const automerge = [
        {
          target: 'EPD',
          source: ['EPD', 'DEV']
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeTruthy();
    });

    it('Invalid Branch in List names', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'PPR';

      const automerge = [
        {
          target: 'EPD',
          source: ['EPD', 'DEV']
        }
      ];

      expect(branch.checkBranch(pullRequest, automerge)).toBeFalsy();
    });
  });
});
