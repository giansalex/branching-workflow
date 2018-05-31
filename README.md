# Branch Workflow - Github Bot
[![Build Status](https://travis-ci.org/giansalex/branching-workflow.svg?branch=master)](https://travis-ci.org/giansalex/branching-workflow)
[![codecov](https://codecov.io/gh/giansalex/branching-workflow/branch/master/graph/badge.svg)](https://codecov.io/gh/giansalex/branching-workflow)
Auto Merge and Branch WorkFlow Probot APP.

> A GitHub App built with [probot](https://github.com/probot/probot). 

## Configuration file
Create `.github/branch.yml` and configure your branches.

```yaml
autoMerge:
  - target: EPD
    source: EPD
  - target: QAS
    source: QAS

restrict:
  - target: master
    source:
      - ppr
      - pprfix
    close: true
  - target: ppr
    source: qas
```

Pull Request with title `[WIP]` aren't merged.

## Github App Permissions
- Repository metadata: **Read-only**
- Pull requests: **Read & write**
- Single file: **Read-only**, path: `.github/branch.yml`
- Commit statuses: **Read & write**

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```
