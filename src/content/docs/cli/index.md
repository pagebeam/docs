---
title: CLI reference
description: pagebeam commands, options, profiles and exit codes.
---

```text
pagebeam init  [--cwd <dir>]
pagebeam check [--cwd <dir>] [--json] [--profile observe|enforce|enforce-all]
pagebeam fix   [--cwd <dir>] [--publish]
```

| Command                  | Does                                         |
| ------------------------ | -------------------------------------------- |
| `pagebeam init`          | Write a config by looking at the repository  |
| `pagebeam check`         | Report everything, block nothing             |
| `pagebeam fix`           | Say what it would propose, and touch nothing |
| `pagebeam fix --publish` | Open or update the pull request              |

## Options

| Option      | Meaning                                                                   |
| ----------- | ------------------------------------------------------------------------- |
| `--cwd`     | The directory holding `pagebeam.config.*`. Default: the current directory |
| `--json`    | Machine-readable output                                                   |
| `--publish` | Actually open or update the pull request                                  |
| `--profile` | What blocks. See below                                                    |

## Profiles

| Profile             | Blocks on                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------------------- |
| `observe` (default) | Nothing. Reports everything                                                                        |
| `enforce`           | [Proven](/checks/standing/) findings this change introduced. A finding of unknown age never blocks |
| `enforce-all`       | Any proven finding, whatever its age                                                               |

A finding's age is known when pagebeam can judge the earlier revision by the same rules as the current one. A link checked against today's build has no earlier build to compare with, so under `enforce` it reports without blocking. Use `enforce-all` where a broken link should fail the job regardless.

## Exit codes

| Code | Meaning                                                                                     |
| ---- | ------------------------------------------------------------------------------------------- |
| `0`  | Nothing blocks                                                                              |
| `1`  | A proven finding blocks, under an enforcing profile                                         |
| `2`  | The answer cannot be trusted: nothing was read, or a check that was asked for could not run |
