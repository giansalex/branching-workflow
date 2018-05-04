async function pullRequest (context) {
    // 1. Extract necessary info
  const issue = context.issue()
  const { payload, github, log } = context
  const { sha } = payload.pull_request.head


  }

}
