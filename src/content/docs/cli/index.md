---
title: CLI reference
description: pagebeam commands, options, profiles and exit codes.
---

```text
pagebeam init  [--cwd <dir>]
pagebeam check [--cwd <dir>] [--json] [--profile observe|enforce|enforce-all]
pagebeam fix   [--cwd <dir>] [--publish]
```

| Command                  | Does                                           |
| ------------------------ | ---------------------------------------------- |
| `pagebeam init`          | Writes a config by looking at the repository   |
| `pagebeam check`         | Reports everything and blocks nothing          |
| `pagebeam fix`           | Says what it would propose and changes nothing |
| `pagebeam fix --publish` | Opens or updates the pull request              |

## Options

| Option      | Meaning                                                                |
| ----------- | ---------------------------------------------------------------------- |
| `--cwd`     | The folder that holds `pagebeam.config.*`. Default: the current folder |
| `--json`    | Output for machines                                                    |
| `--publish` | Actually open or update the pull request                               |
| `--profile` | What blocks. See below                                                 |

## Profiles

| Profile             | Blocks on                                                                                     |
| ------------------- | --------------------------------------------------------------------------------------------- |
| `observe` (default) | Nothing. Reports everything                                                                   |
| `enforce`           | [Proven](/checks/standing/) findings the change introduced. Never on a finding of unknown age |
| `enforce-all`       | Every proven finding, however old                                                             |

pagebeam knows a finding's age when it can check the earlier revision the same way it checked this one. A link is checked against today's build, and there is no older build. So its age is unknown, and `enforce` reports it without blocking. Use `enforce-all` if a broken link should fail the job.

## Exit codes

| Code | Meaning                                                                            |
| ---- | ---------------------------------------------------------------------------------- |
| `0`  | Nothing blocks                                                                     |
| `1`  | A proven finding blocks, under an enforcing profile                                |
| `2`  | The answer cannot be trusted: nothing was read, or a requested check could not run |
