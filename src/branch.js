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

module.exports = {
  resolveSourceBranch: getSourceBranch
};
