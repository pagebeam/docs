---
title: Run in CI
description: Check your docs on every pull request with the pagebeam GitHub Action, including when the product lives in another repository.
---

The pagebeam action checks out every repository the docs describe, runs pagebeam from the docs, and writes what it found to the job summary.

## Check every pull request

Add one workflow to the product repository. It runs when the product changes, which is when the docs start to go wrong.

```yaml
name: docs drift

on:
  pull_request:
  push:
    branches: [main]

jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: pagebeam/pagebeam@v1
        with:
          docs: your-org/docs
          token: ${{ secrets.PAGEBEAM_TOKEN }}
```

Leave out `docs` when the docs live in the same repository as the product.

## Where the repositories go

The action checks out each repository inside the workspace at `<owner>/<name>`, with its full history. Repositories with the same owner sit next to each other, so the config in the docs repository points one folder up, just as it does on a laptop:

```yaml
apps:
  - name: dashboard
    path: ../dashboard
```

For a repository with another owner, the path goes through its owner: `../../other-org/dashboard`.

A later step in the same job finds a repository at `$GITHUB_WORKSPACE/<owner>/<name>`, not at the workspace root.

## Fail a pull request that breaks the docs

```yaml
- uses: pagebeam/pagebeam@v1
  with:
    docs: your-org/docs
    profile: enforce
    token: ${{ secrets.PAGEBEAM_TOKEN }}
```

`enforce` blocks only on proven findings that the change introduced. A link is checked against today's build, and there is no older build to compare with. So pagebeam cannot tell whether a broken link is new, and `enforce` only reports it. Use `enforce-all` to block on every proven finding. See [profiles](/cli/#profiles).

## Propose fixes on a schedule

In the docs repository, name the products and let pagebeam open or update one pull request with the fixes it can work out:

```yaml
on:
  schedule:
    - cron: '0 6 * * *'

jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: pagebeam/pagebeam@v1
        with:
          products: |
            your-org/dashboard
          command: fix
          publish: 'true'
          token: ${{ secrets.PAGEBEAM_TOKEN }}
```

To have a model draft what the source cannot settle, pass its key as `model-key` and name the variable your config's `model.apiKeyEnv` expects in `model-key-env`. See [proposals](/proposals/).

## Tokens

The job's own token reaches only the repository the workflow runs in. To read another repository, or open a pull request in one, pass a token that can. A GitHub App installation token is the narrowest. To publish in the repository the workflow runs in, give the job `contents: write` and `pull-requests: write`.

## Inputs

| Input           | Meaning                                                          | Default                |
| --------------- | ---------------------------------------------------------------- | ---------------------- |
| `docs`          | The docs repository, as owner/name, when it is not this one      | this repository        |
| `docs-ref`      | The branch of the docs repository to read                        | its default branch     |
| `products`      | Other product repositories to check out, one owner/name per line | none                   |
| `command`       | `check` to report, `fix` to propose                              | `check`                |
| `profile`       | `observe`, `enforce` or `enforce-all`                            | `observe`              |
| `publish`       | With `fix`, open or update the pull request                      | `false`                |
| `cwd`           | The folder holding the config, relative to the workspace         | the docs checkout      |
| `token`         | Reads the other repositories and opens the pull request          | the job's own token    |
| `model-key`     | Your model provider's key, as a secret                           | none                   |
| `model-key-env` | The variable your config's `model.apiKeyEnv` names               | `OPENAI_API_KEY`       |
| `version`       | The pagebeam release to run                                      | the release you pinned |

The action's output `said` holds what the run printed.

## Other CI systems

pagebeam reads files, so any CI works. Check out the docs and every application at the paths the config gives, with full history (`fetch-depth: 0` on GitHub), then run `npx pagebeam check` from the docs. Without the history pagebeam cannot tell whether a finding is new, and `enforce` never blocks.

These docs are checked this way. Their workflow checks out the pagebeam CLI next to them on every pull request.
