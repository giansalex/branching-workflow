/* eslint-disable semi */
const branch = require('./branch');

async function workflow (context, config) {
  const { github, payload } = context;

  if (!config.restrict) {
    return;
  }

  if (branch.checkBranch(payload.pull_request, config.restrict)) {
    return;
  }

  const parameters = {
    context: 'BRANCH',
    description: "¡Shouldn't to merge this branch!",
    owner: payload.repository.owner.login,
    repo: payload.repository.name,
    state: 'error',
    sha: payload.head.sha
  };

  github.repos.createStatus(parameters);
}

module.exports = workflow;
