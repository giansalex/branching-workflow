/* eslint-disable semi */
const SkipMessage = '[WIP]'; // Work in Progress
const branch = require('./branch');

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

  tryMerge(config, context);
}

function checkEvent(payload) {
  const pullRequest = payload.pull_request;
  return payload.action === 'open' && !pullRequest.merged;
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

  const targetBranch = pullRequest.base.ref;
  const sourceBranch = pullRequest.head.ref;

  const validSource = branch.resolveSourceBranch(targetBranch, autoMerge);

  if (!validSource) {
    return;
  }

  return validSource === sourceBranch;
}

function containsSkipMessage (text) {
  return text.indexOf(SkipMessage) > -1;
}

module.exports = pullRequest;
