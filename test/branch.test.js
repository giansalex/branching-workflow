/* eslint-disable semi */
const event = require('./events/pull_request.opened');
const { payload } = event;
const branch = require('../src/branch');

describe('Branch Workflow', () => {
  describe('Branch Checker', () => {
    it('Not Configured', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'EPD';
      const automerge = [
        {
          target: 'QAS',
          source: 'QAS'
        }
      ];

      expect(branch.resolveSourceBranch(pullRequest, automerge)).toBeFalsy();
    });

    it('Configured', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'EPD';
      const automerge = [
        {
          target: 'EPD',
          source: 'EPD'
        }
      ];

      expect(branch.resolveSourceBranch(pullRequest, automerge)).toBeTruthy();
    });

    it('Valid Branch Name', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'EPD';

      expect(branch.checkBranch(pullRequest, 'EPD')).toBeTruthy();
    });

    it('Invalid Branch Name', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'QAS';

      expect(branch.checkBranch(pullRequest, 'EPD')).toBeFalsy();
    });

    it('Valid Branch in List names', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'EPD';

      expect(branch.checkBranch(pullRequest, ['EPD', 'DEV'])).toBeTruthy();
    });

    it('Invalid Branch in List names', () => {
      const pullRequest = payload.pull_request;
      pullRequest.head.ref = 'PPR';

      expect(branch.checkBranch(pullRequest, ['EPD', 'DEV'])).toBeFalsy();
    });
  });
});
