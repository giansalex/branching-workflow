/* eslint-disable semi */
const branch = require('./branch');
const ALERT_MESSAGE = "¡Shouldn't to merge this branch!";
const TITLE_STATUS = 'Branch Flow';

async function workflow (context, config) {
  const { github, payload } = context;

  if (!config.restrict) {
    return;
  }

  const status = getStatus(payload.pull_request, config.restrict);
  if (!status || status.valid) {
    return;
  }

  await createStatus(payload, github);

  if (status.close) {
    await closePull(payload, github);
  }
}

function getStatus (pullRequest, restrictBranches) {
  const config = branch.resolveConfigForBranch(pullRequest, restrictBranches);

  if (!config) {
    return null;
  }

  return {
    valid: branch.checkBranch(pullRequest, config.source),
    close: config.close
  };
}

async function createStatus (payload, github) {
  const parameters = {
    context: TITLE_STATUS,
    description: ALERT_MESSAGE,
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    state: 'error',
    sha: payload.pull_request.head.sha
  };

  await github.repos.createStatus(parameters);
}

async function closePull (payload, github) {
  const parameters = {
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    number: payload.number,
    state: 'closed'
  };

  await github.pullRequests.update(parameters);
}

module.exports = workflow;
