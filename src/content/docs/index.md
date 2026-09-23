---
title: pagebeam
description: pagebeam checks each page of your docs against the product it describes, says how sure it is, and opens a pull request with the fixes it can make.
---

pagebeam checks each page of your docs against the product it describes. It says how sure it is. It opens a pull request with the fixes it can make. It is open source and runs in the repository you already have.

## Try it

Run two commands in the repository that holds your docs:

```sh
npx pagebeam init
npx pagebeam check
```

`init` writes `pagebeam.config.yaml`. `check` only reads and reports. It writes nothing else and sends nothing anywhere.

## Read next

- [Getting started](/getting-started/): what `init` finds, and docs kept in another repository.
- [Run in CI](/getting-started/ci/): check every pull request.
- [Checks](/checks/): the six checks and what each compares a page with.
- [Standing](/checks/standing/): what `proven` and `review` mean, and what can fail a build.
- [Configuration](/configuration/): every setting in `pagebeam.config.yaml`.
- [Proposals](/proposals/): drafting fixes with a model you choose, and what it sends.
- [CLI reference](/cli/): commands, profiles and exit codes.
