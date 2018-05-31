/* eslint-disable semi */
function getConfigBranch (target, branches) {
  const len = branches.length;
  const branch = target.toUpperCase();

  for (let i = 0; i < len; i++) {
    const item = branches[i];
    if (item.target.toUpperCase() === branch) {
      return item;
    }
  }

  return null;
}

function resolveConfigForBranch (pullRequest, branches) {
  const targetBranch = pullRequest.base.ref;

  return getConfigBranch(targetBranch, branches);
}

function checkBranch (pullRequest, configSource) {
  const sourceBranch = pullRequest.head.ref.toUpperCase();

  if (Array.isArray(configSource)) {
    const sourceList = configSource.map(branch => branch.toUpperCase());
    return sourceList.includes(sourceBranch);
  }

  return configSource.toUpperCase() === sourceBranch;
}

module.exports = {
  resolveConfigForBranch: resolveConfigForBranch,
  checkBranch: checkBranch
};
