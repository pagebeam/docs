---
title: pagebeam
description: pagebeam checks every page of your documentation against the application it describes, says how sure it is, and opens the pull request that fixes what it can.
---

pagebeam checks every page against the application it describes, tells you how sure it is, and opens the pull request that fixes what it can. It is open source, and it runs in the repository you already have.

## Try it

Two commands, in the repository holding your documentation:

```sh
npx pagebeam init
npx pagebeam check
```

`init` writes `pagebeam.config.yaml`. `check` reads and reports: nothing is written outside that one file, and nothing reaches a remote.

## Read next

- [Getting started](/getting-started/): what `init` works out, and pointing at a product in another repository.
- [Checks](/checks/): the six checks and what each one compares a page with.
- [Standing](/checks/standing/): what `proven` and `review` mean, and which findings can fail a build.
- [Configuration](/configuration/): every key in `pagebeam.config.yaml`.
- [Proposals](/proposals/): drafting fixes with a model you choose, and what leaves the machine.
- [CLI reference](/cli/): commands, profiles and exit codes.
