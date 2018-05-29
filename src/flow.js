/* eslint-disable semi */
const branch = require('./branch');

async function workflow (context, config) {
  const { github, payload, log } = context;

  if (payload.pull_request.action !== 'opened') {
    return;
  }

  if (canMerge(payload, config.restrict)) {
    log.warn('Cannot Merge');
    return;
  }
  const parameters = {
    context: 'BRANCH',
    description: 'No se debería fusionar',
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    state: 'error',
    sha: payload.head.sha
  };

  github.repos.createStatus(parameters);
}

function canMerge (payload, restrict) {
  const pullRequest = payload.pull_request;
  const targetBranch = pullRequest.base.ref;
  const sourceBranch = pullRequest.head.ref;

  const validSource = branch.resolveSourceBranch(targetBranch, restrict);

  if (!validSource) {
    return;
  }

  return validSource === sourceBranch;
}
module.exports = workflow;
