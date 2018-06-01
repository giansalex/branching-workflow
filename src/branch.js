/* eslint-disable semi */

function getConfigBranch (target, branches) {
  const targetBranch = target.toUpperCase();

  return branches.find((branch) => branch.target.toUpperCase() === targetBranch);
}

const branch = {
  resolveConfigForBranch (pullRequest, branches) {
    const targetBranch = pullRequest.base.ref;

    return getConfigBranch(targetBranch, branches);
  },

  checkBranch (pullRequest, configSource) {
    const sourceBranch = pullRequest.head.ref.toUpperCase();

    if (Array.isArray(configSource)) {
      const sourceList = configSource.map((branch) => branch.toUpperCase());
      return sourceList.includes(sourceBranch);
    }

    return configSource.toUpperCase() === sourceBranch;
  }
};

module.exports = branch;
