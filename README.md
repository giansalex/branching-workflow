# Branch Workflow - Github Bot

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
```

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```
