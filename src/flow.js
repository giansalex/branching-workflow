/* eslint-disable semi */
const branch = require('./branch');
const ALERT_MESSAGE = "¡Shouldn't to merge this branch!";
const TITLE_STATUS = 'Branch Flow';

async function workflow (context, config) {
  const { github, payload } = context;

  if (!config.restrict) {
    return;
  }

  if (!canCreateStatus(payload.pull_request, config.restrict)) {
    return;
  }

  createStatus(payload, github);
}

function canCreateStatus (pullRequest, restrictBranches) {
  const config = branch.resolveConfigForBranch(pullRequest, restrictBranches);

  if (!config) {
    return false;
  }

  return !branch.checkBranch(pullRequest, config.source);
}

function createStatus (payload, github) {
  const parameters = {
    context: TITLE_STATUS,
    description: ALERT_MESSAGE,
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    state: 'error',
    sha: payload.pull_request.head.sha
  };

  github.repos.createStatus(parameters);
}
module.exports = workflow;
