---
title: Getting started
description: Write a pagebeam config for the docs you already have, then run your first check.
---

Run both commands in the repository that holds your docs:

```sh
npx pagebeam init
npx pagebeam check
```

## init

`init` looks at the repository and writes `pagebeam.config.yaml`. The file says where your pages are and which applications they describe. `init` tells you what it found and what it could not, so you can fix the file before the first run.

It writes nothing else and sends nothing anywhere.

`init` looks for applications in the folders next to this repository. Check the `apps` it wrote: it may list folders your docs do not describe.

## check

`check` reads and reports. It groups findings by page, because you fix docs one page at a time.

On its own, `check` blocks nothing. It exits with an error only when it cannot trust its answer, for example when it read nothing. To block on findings, see [profiles](/cli/#profiles).

## Docs in another repository

If your product lives in another repository, check out both side by side. The config can live in either one. Here it lives in the product repository and points at the docs:

```yaml
docs:
  root: ../docs/content
apps:
  - name: dashboard
    path: .
```

Paths are relative to the folder you run pagebeam in. [Run in CI](/getting-started/ci/) shows the same layout in GitHub Actions. [Configuration](/configuration/) lists every setting.
