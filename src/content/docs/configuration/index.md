---
title: Configuration
description: The settings in pagebeam.config.yaml, with an example of each.
---

`pagebeam.config.yaml` sits next to your docs. pagebeam checks every setting. A setting it does not know is an error.

Paths are relative to the folder you run pagebeam in.

```yaml
docs:
  root: docs # where the pages are
  include: ['**/*.{md,mdx,markdown,astro}']
  buildDir: dist # the built site, if there is one
  routeBase: /docs # if the site serves these pages under a prefix

history:
  sinceDays: 30 # how far back to compare

apps: # every application the docs describe
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

Where the pages are and which files count as pages. `buildDir` is the built site: with it, `links` checks the routes that were really built. Set `routeBase` when the site serves the pages under a prefix.

## history

How far back `strings` and `moved` look.

## apps

Every application the docs describe. `configKeys` reads the example configs in `envFiles`. With `url`, `routes` and `auth`, pagebeam also opens a running copy. See [Coverage](/checks/coverage/).

### OpenAPI specifications

The `openapi` check runs only for an application that names its spec. Without one, it reports "no application declares a specification" and does not run.

```yaml
apps:
  - name: api
    path: ../api
    openapi:
      spec: ../api/openapi.yaml
```

## checks

Settings for each check. `strings` and `moved` stay off until they appear here. See [Checks](/checks/).

## model

The provider that drafts fixes. See [Proposals](/proposals/).

## propose

The branch, base and commit type that `fix --publish` uses for its pull request.

## Ignoring a finding

To leave a finding out of every report, list its id in `.pagebeam/ignore.yml`, inside the folder you run pagebeam in. Say why, and who decided.

```yaml
findings:
  - id: 9f3a1c07b2e4
    reason: The CDN serves this route, not the site
    by: docs-team
```
