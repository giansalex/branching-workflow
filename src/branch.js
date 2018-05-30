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

function checkBranch (pullRequest, branches) {
  const targetBranch = pullRequest.base.ref;
  const sourceBranch = pullRequest.head.ref;

  const validSource = getSourceBranch(targetBranch, branches);

  if (!validSource) {
    return;
  }

  if (Array.isArray(validSource)) {
    return validSource.includes(sourceBranch);
  }

  return validSource === sourceBranch;
}

module.exports = {
  resolveSourceBranch: getSourceBranch,
  checkBranch: checkBranch
};
