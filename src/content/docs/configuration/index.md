---
title: Configuration
description: Every key in pagebeam.config.yaml, with an example of each.
---

`pagebeam.config.yaml` sits beside the documentation. Every setting is checked: one that does not exist is an error, not a shrug.

```yaml
docs:
  root: docs # where the pages are
  include: ['**/*.{md,mdx,markdown,astro}']
  buildDir: dist # the built site, if there is one
  routeBase: /docs # if the site serves these pages under a prefix

history:
  sinceDays: 30 # how far back to compare

apps: # every application the documentation describes
  - name: dashboard
    path: ../dashboard
    include: ['**/*.{vue,ts,tsx,js}']
    envFiles: ['.env.example']
    url: http://localhost:3000 # optional: open it and read what it shows
    routes: ['/', '/settings']
    auth:
      script: ./.pagebeam/login.mjs
      confirm: 'text=Sign out'

checks:
  strings: { minConfidence: 0.4 }
  moved: {}

model:
  baseUrl: https://api.openai.com/v1 # or a gateway, or one on this machine
  name: gpt-4o
  apiKeyEnv: OPENAI_API_KEY

propose:
  branch: pagebeam/drift
  base: main
  commitPrefix: docs # the type every commit and the title use
```

## docs

Where the pages are, which files count as pages, and where the built site is. `buildDir` lets `links` check routes against what was actually built. Set `routeBase` when the site serves these pages under a prefix.

## history

How far back `strings` and `moved` compare.

## apps

Every application the documentation describes. `envFiles` are the example configs `configKeys` reads. `url`, `routes` and `auth` let pagebeam open a running copy; see [Coverage](/checks/coverage/).

## checks

Settings for each check. `strings` and `moved` are off until they appear here; see [Checks](/checks/).

## model

The provider asked to draft fixes. See [Proposals](/proposals/).

## propose

The branch, base and commit type used when `fix --publish` opens or updates the pull request.
