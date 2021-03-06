# Branch Workflow - Github Bot
[![Build Status](https://travis-ci.org/giansalex/branching-workflow.svg?branch=master)](https://travis-ci.org/giansalex/branching-workflow)
[![codecov](https://codecov.io/gh/giansalex/branching-workflow/branch/master/graph/badge.svg)](https://codecov.io/gh/giansalex/branching-workflow)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8c1f7e742472499987106c14ef3a8a9b)](https://app.codacy.com/app/giansalex/branching-workflow?utm_source=github.com&utm_medium=referral&utm_content=giansalex/branching-workflow&utm_campaign=badger)
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

## Github App Permissions & Events
**Permissions**
- Repository contents - **Read & write** 
- Repository metadata - **Read-only**
- Pull requests - **Read & write**
- Single File - **Read-only**
  - Path: `.github/branch.yml`
- Commit statuses - **Read & write**

**Events**
- [x] Check the box for **Pull request** events

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker
Using node alpine image.
> You need to have `private.pem` file.

```sh
docker build -t branch-bot .
docker run -d -p 80:3000 -e APP_ID=<you-app-id> -e WEBHOOK_SECRET=<your-secret> -e PRIVATE_KEY=$(cat private.pem) --name gitbot branch-bot
```
