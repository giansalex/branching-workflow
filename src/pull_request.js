/* eslint-disable semi */
async function pullRequest (context) {
  const { log } = context;
  const config = await context.config('branch.yml');

  if (!config) {
    log.warn('Branch Config cannot load');
    return;
  }
  tryMerge(config, context);
}

function tryMerge (config, context) {
  const { github, payload, log } = context;
  if (!config.autoMerge) {
    log.warn('AutoMerge: section not found');
    return;
  }

  if (!canMerge(payload, config.autoMerge)) {
    return;
  }

  log.info('Merge starting...');

  const parameters = {
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    number: payload.number,
    // sha: payload.pull_request.head.sha,
    // merge_method: 'merge'
  };
  // console.log(parameters);
  github.pullRequests.merge(parameters);
}

function canMerge (payload, autoMerge) {
  const pullRequest = payload.pull_request;
  const isMerged = payload.action === 'closed' && pullRequest.merged;

  if (isMerged) {
    return;
  }

  const targetBranch = pullRequest.base.ref;
  const sourceBranch = pullRequest.head.ref;

  const validSource = getSourceBranch(targetBranch, autoMerge);

  if (!validSource) {
    return;
  }

  return validSource === sourceBranch;
}

function getSourceBranch (target, autoMerge) {
  const len = autoMerge.length;

  for (let i = 0; i < len; i++) {
    const item = autoMerge[i];
    if (item.target === target) {
      return item.source;
    }
  }

  return null;
}

module.exports = pullRequest;
