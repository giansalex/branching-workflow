# Branch Workflow - Github Bot
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8c1f7e742472499987106c14ef3a8a9b)](https://app.codacy.com/app/giansalex/branching-workflow?utm_source=github.com&utm_medium=referral&utm_content=giansalex/branching-workflow&utm_campaign=badger)
[![Build Status](https://travis-ci.org/giansalex/branching-workflow.svg?branch=master)](https://travis-ci.org/giansalex/branching-workflow)
[![codecov](https://codecov.io/gh/giansalex/branching-workflow/branch/master/graph/badge.svg)](https://codecov.io/gh/giansalex/branching-workflow)
[![Maintainability](https://api.codeclimate.com/v1/badges/0f8d8f506402058c30a9/maintainability)](https://codeclimate.com/github/giansalex/branching-workflow/maintainability)    
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
    fork: true
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

## Docker
Using node alpine image.

```sh
docker build -t branch-bot .
docker run -d -p 80:3000 -e APP_ID=<you-app-id> -e WEBHOOK_SECRET=<your-secret> --name gitbot branch-bot
```