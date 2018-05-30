/* eslint-disable semi */
const SkipMessage = '[WIP]'; // Work in Progress
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
  const { github, payload, log } = context;
  if (!config.autoMerge) {
    log.warn('AutoMerge: section not found');
    return false;
  }

  if (!canMerge(payload.pull_request, config.autoMerge)) {
    return false;
  }

  log.info('Merge starting...');

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

  return branch.checkBranch(pullRequest, autoMerge);
}

function containsSkipMessage (text) {
  return text.indexOf(SkipMessage) > -1;
}

module.exports = pullRequest;
