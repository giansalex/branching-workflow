/* eslint-disable semi */
const event = require('./events/pull_request.opened');
const pullRequest = event.payload.pull_request;
const branch = require('../src/branch');

describe('Branch Workflow', () => {
  describe('Branch Checker', () => {
    it('Not Configured', () => {
      pullRequest.head.ref = 'EPD';
      const automerge = [
        {
          target: 'QAS',
          source: 'QAS'
        }
      ];

      expect(branch.resolveConfigForBranch(pullRequest, automerge)).toBeFalsy();
    });

    it('Configured', () => {
      pullRequest.head.ref = 'EPD';
      const automerge = [
        {
          target: 'EPD',
          source: 'EPD'
        }
      ];

      expect(branch.resolveConfigForBranch(pullRequest, automerge)).toBeTruthy();
    });

    it('Valid Branch Name', () => {
      pullRequest.head.ref = 'EPD';

      expect(branch.checkBranch(pullRequest, 'EPD')).toBeTruthy();
    });

    it('Invalid Branch Name', () => {
      pullRequest.head.ref = 'QAS';

      expect(branch.checkBranch(pullRequest, 'EPD')).toBeFalsy();
    });

    it('Valid Branch in List names', () => {
      pullRequest.head.ref = 'EPD';

      expect(branch.checkBranch(pullRequest, ['EPD', 'DEV'])).toBeTruthy();
    });

    it('Invalid Branch in List names', () => {
      pullRequest.head.ref = 'PPR';

      expect(branch.checkBranch(pullRequest, ['EPD', 'DEV'])).toBeFalsy();
    });
  });
});
