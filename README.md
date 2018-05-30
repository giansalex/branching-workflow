# Branch Workflow - Github Bot
[![Build Status](https://travis-ci.org/giansalex/branching-workflow.svg?branch=master)](https://travis-ci.org/giansalex/branching-workflow)  
AutoMerge and Branch WorkFlow Probot APP.

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
    source: ppr
  - target: ppr
    source: qas
```

Pull Request with title message: `[WIP]` aren't merged.

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```
