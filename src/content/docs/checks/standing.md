---
title: Standing
description: Every pagebeam finding is proven or review. Only proven findings can fail a build.
---

A finding claims only what its evidence supports.

**proven**: the source of truth says so. The built site has no such route. A control was in the application at a known revision and is gone now.

**review**: worth a look, but not proof. pagebeam could not find it, which does not mean the product lacks it. A label may be built at runtime, or live in code no parser reads.

Only `proven` findings can fail a build, and only under an enforcing profile:

```sh
pagebeam check --profile enforce
```

This fails on proven findings the change introduced. See the [CLI reference](/cli/) for all profiles and exit codes.
