/* eslint-disable semi */
const branch = require('./branch');
const ALERT_MESSAGE = '¡Shouldn\'t to merge this branch!';
const TITLE_STATUS = 'Branch Flow';

function isFork(pullRequest) {
  return pullRequest.head.repo.fork;
}

function getStatus (pullRequest, restrictBranches) {
  const config = branch.resolveConfigForBranch(pullRequest, restrictBranches);

  if (!config) {
    return null;
  }

  const notAllowFork = !config.fork;
  if (notAllowFork && isFork(pullRequest)) {
    return {
      valid: false,
      close: config.close
    };
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

function skipCreateStatus (status) {
  return !status || status.valid;
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

async function processBranch (payload, github, branches) {
  const status = getStatus(payload.pull_request, branches);
  if (skipCreateStatus(status)) {
    return;
  }

  await createStatus(payload, github);

  if (status.close) {
    await closePull(payload, github);
  }
}

async function workflow (context, config) {
  const { github, payload } = context;

  if (!config.restrict) {
    return;
  }

  await processBranch(payload, github, config.restrict);
}

module.exports = workflow;
