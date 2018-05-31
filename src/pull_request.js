/* eslint-disable semi */
const SKIP_MESSAGE = '[WIP]'; // Work in Progress
const branch = require('./branch');
const flow = require('./flow');

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

function checkEvent (payload) {
  const pullRequest = payload.pull_request;
  return pullRequest.state === 'open' && !pullRequest.merged;
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

function canMerge (pullRequest, autoMerge) {
  const title = pullRequest.title.toUpperCase();
  if (containsSkipMessage(title)) {
    return;
  }

  const configSource = branch.resolveSourceBranch(pullRequest, autoMerge);

  if (!configSource) {
    return false;
  }

  return branch.checkBranch(pullRequest, configSource);
}

function containsSkipMessage (text) {
  return text.indexOf(SKIP_MESSAGE) > -1;
}

module.exports = pullRequest;
