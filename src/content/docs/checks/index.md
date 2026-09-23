---
title: Checks
description: The six pagebeam checks, what each compares a page with, and which are on by default.
---

Each check compares a page with a source of truth about the product.

| Check          | Finds                                                                              | Default |
| -------------- | ---------------------------------------------------------------------------------- | ------- |
| `links`        | A link to a route or file that does not exist                                      | on      |
| `configKeys`   | A setting the docs describe that no example config declares                        | on      |
| `openapi`      | An endpoint the docs describe that the spec lacks, and endpoints no page describes | on      |
| `strings`      | A control the docs name that the application no longer has                         | off     |
| `moved`        | Code that changed under a page that did not change with it                         | off     |
| `undocumented` | A screen of controls the docs never mention                                        | on      |

## Checks that compare revisions

`strings` and `moved` compare today's code with an earlier revision. They are off until you turn them on:

```yaml
history:
  sinceDays: 30 # how far back to compare

checks:
  strings: { minConfidence: 0.4 }
  moved: {}
```

## undocumented

`undocumented` reads the application, not its history. Its findings are always `review`, so it never fails a build. See [Standing](/checks/standing/).

## What each check reads

A check sees the application's files, a running copy of it, or both. See [Coverage](/checks/coverage/).
