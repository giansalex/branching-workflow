/* eslint-disable semi */
async function pullRequest (context) {
  const { log } = context;
  const config = await context.config('branch.yml');

  if (!config) {
    log.warn('Branch Config cannot load');
    return;
  }
  tryMerge();
}

function tryMerge (config, context) {
  const { github, payload, log } = context;
  if (config.autoMerge) {
    log.warn('AutoMerge: section not found');
    return;
  }

  if (!canMerge(payload, config.autoMerge)) {
    return;
  }

  github.pullRequests.merge(context.issue());
}

function canMerge (payload, autoMerge) {
  const isMerged = payload.action === 'closed' && payload.pull_request.merged;

  if (isMerged) {
    return;
  }

  const targetBranch = payload.base.ref;
  const sourceBranch = payload.head.ref;

  const validSource = getSourceBranch(targetBranch, autoMerge);

  if (!validSource) {
    return;
  }

  return validSource === sourceBranch;
}

function getSourceBranch (target, autoMerge) {
  const len = autoMerge.length;
  for (let i = 0; i++ < len; i++) {
    const item = autoMerge[i];

    if (item.target === target) {
      return item.source;
    }
  }

  return null;
}

module.exports = pullRequest;
