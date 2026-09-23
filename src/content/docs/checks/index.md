---
title: Checks
description: The six pagebeam checks, what each one compares a page with, and which are on by default.
---

Each check compares a page with a source of truth about the product.

| Check          | Finds                                                                                 | Default |
| -------------- | ------------------------------------------------------------------------------------- | ------- |
| `links`        | A page pointing at a route or a file that is not there                                | on      |
| `configKeys`   | A setting the documentation describes that no example config declares                 | on      |
| `openapi`      | An endpoint documented that the specification lacks, and operations nothing documents | on      |
| `strings`      | A control named in the documentation that the application no longer has               | off     |
| `moved`        | Code changing under a page that did not change with it                                | off     |
| `undocumented` | A screen of controls the documentation never mentions                                 | on      |

## Checks that compare revisions

`strings` and `moved` are off until asked for, and compare against an earlier revision. Turn them on under `checks`:

```yaml
history:
  sinceDays: 30 # how far back to compare

checks:
  strings: { minConfidence: 0.4 }
  moved: {}
```

## undocumented

`undocumented` reads the application rather than its history, and is always `review`, so it reports without ever failing a build. See [Standing](/checks/standing/).

## What each check reads

What a check can see depends on how the application is read: its files, a running copy of it, or both. See [Coverage](/checks/coverage/).
