/* eslint-disable semi */
const SKIP_MESSAGE = '[WIP]'; // Work in Progress
const branch = require('./branch');
const flow = require('./flow');

function containsSkipMessage (text) {
  return text.indexOf(SKIP_MESSAGE) > -1;
}

function checkEvent (payload) {
  const pullRequest = payload.pull_request;
  return pullRequest.state === 'open' && !pullRequest.merged;
}

function canMerge (pullRequest, autoMerge) {
  const title = pullRequest.title.toUpperCase();
  if (containsSkipMessage(title)) {
    return;
  }

  const config = branch.resolveConfigForBranch(pullRequest, autoMerge);

  if (!config) {
    return false;
  }

  return branch.checkBranch(pullRequest, config.source);
}

function tryMerge (config, context) {
  const { github, payload } = context;
  if (!config.autoMerge) {
    return false;
  }

  if (!canMerge(payload.pull_request, config.autoMerge)) {
    return false;
  }

  const parameters = {
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    number: payload.number
  };

  github.pullRequests.merge(parameters);

  return true;
}

async function pullRequest (context) {
  const { log, payload } = context;

  if (!checkEvent(payload)) {
    return;
  }

  const config = await context.config('branch.yml');

  if (!config) {
    log.warn('Branch Config cannot load');
    return;
  }

  if (tryMerge(config, context)) {
    return;
  }

  flow(context, config);
}

module.exports = pullRequest;
