---
title: Run in CI
description: Check your docs on every pull request with GitHub Actions, including when the product lives in another repository.
---

pagebeam reads files. In CI, the docs and every application in the config must be checked out, at the paths the config gives.

## Docs and product in one repository

```yaml
name: docs

on: [pull_request]

jobs:
  pagebeam:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npx pagebeam check --profile enforce
```

`fetch-depth: 0` fetches the full history. pagebeam needs it to tell whether a finding is new. Without it, `enforce` never blocks.

## Docs in another repository

`apps[].path` is a folder. Check out both repositories side by side so the folder exists:

```yaml
steps:
  - uses: actions/checkout@v4
    with:
      path: docs
      fetch-depth: 0
  - uses: actions/checkout@v4
    with:
      repository: acme/dashboard
      path: dashboard
      fetch-depth: 0
      # a private repository needs a token that can read it:
      # token: ${{ secrets.DASHBOARD_READ_TOKEN }}
  - uses: actions/setup-node@v4
    with:
      node-version: 22
  - run: npx pagebeam check --profile enforce
    working-directory: docs
```

Both checkouts need `fetch-depth: 0`. `strings` and `moved` read the product's history, not the docs' history.

The config in `docs/` then points one folder up:

```yaml
apps:
  - name: dashboard
    path: ../dashboard
```

These docs run the same way. Their workflow checks out the pagebeam CLI next to them and checks every pull request.

## Choosing a profile

`enforce` blocks only on proven findings that the change introduced. A link is checked against today's build, and there is no older build to compare with. So pagebeam cannot tell whether a broken link is new, and `enforce` only reports it. Use `enforce-all` to block on every proven finding. See [profiles](/cli/#profiles).
