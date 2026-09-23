---
title: Getting started
description: Write a pagebeam config for the documentation you already have, then run your first check.
---

Run both commands in the repository holding your documentation.

```sh
npx pagebeam init
npx pagebeam check
```

## What init does

`init` looks at what is there and writes `pagebeam.config.yaml`: the directory your prose lives in, and any application beside it. It says what it worked out and what it could not, so you can correct it before the first run rather than after.

Nothing is written outside that one file, and nothing reaches a remote.

## What check does

`check` reads and reports. Findings are grouped by the page you would open to act on them, because that is how the work is done: a page at a time, not a finding at a time.

By default `check` blocks nothing. To fail a build on what a change introduced, see [the enforcing profile](/cli/#profiles).

## Documentation in another repository

If your product lives in a different repository from its documentation, check out both and point at them:

```yaml
docs:
  root: ../docs/content
apps:
  - name: dashboard
    path: .
```

Every application the documentation describes gets an entry under `apps`. See [Configuration](/configuration/) for the rest.
