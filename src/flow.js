/* eslint-disable semi */
const branch = require('./branch');

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
  const configSource = branch.resolveSourceBranch(pullRequest, restrictBranches);

  if (!configSource) {
    return false;
  }

  return !branch.checkBranch(pullRequest, configSource);
}

function createStatus (payload, github) {
  const parameters = {
    context: 'Branch Flow',
    description: "¡Shouldn't to merge this branch!",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    state: 'error',
    sha: payload.pull_request.head.sha
  };

  github.repos.createStatus(parameters);
}
module.exports = workflow;
