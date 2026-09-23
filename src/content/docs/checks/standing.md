---
title: Standing
description: Every pagebeam finding is proven or review. Only proven findings can fail a build.
---

A finding says what its evidence can carry.

**proven**: the source of truth says so. A built site has no such route. A control was in the application at a known revision and is not now.

**review**: worth a person's time, and not proof. Absence from what could be read is not absence from the product. A label may be assembled at runtime, or live in an application no parser covers.

Only `proven` findings can fail a build, and only under an enforcing profile:

```sh
pagebeam check --profile enforce
```

That fails on proven findings this change introduced. See [the CLI reference](/cli/) for exit codes.
