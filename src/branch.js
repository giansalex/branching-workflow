/* eslint-disable semi */
function getSourceBranch (target, branches) {
  const len = branches.length;

  for (let i = 0; i < len; i++) {
    const item = branches[i];
    if (item.target === target) {
      return item.source;
    }
  }

  return null;
}

function resolveSourceBranch (pullRequest, branches) {
  const targetBranch = pullRequest.base.ref;

  return getSourceBranch(targetBranch, branches);
}

function checkBranch (pullRequest, configSource) {
  const sourceBranch = pullRequest.head.ref;

  if (Array.isArray(configSource)) {
    return configSource.includes(sourceBranch);
  }

  return configSource === sourceBranch;
}

module.exports = {
  resolveSourceBranch: resolveSourceBranch,
  checkBranch: checkBranch
};
