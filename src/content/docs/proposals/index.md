---
title: Proposals
description: How pagebeam drafts fixes with a model you choose, what it sends, and what it refuses.
---

A check can prove a page is wrong without knowing what the page should say. If you name a model provider, pagebeam asks it once about each of those findings. It sends the page and the evidence it already has.

Any endpoint that speaks the OpenAI chat completions API works: a provider, a gateway in front of several, or a router on your machine. pagebeam ships no provider code. It never sees your key, only the name of the variable that holds it. Use `headers` if a provider needs more than a bearer token. Set `enrich: false` to keep the provider in the config but stop asking it.

Only `pagebeam fix` asks a model. `pagebeam check` never does.

## Skills

If your project keeps writing guides for its docs, list them under `skills`:

```yaml
model:
  skills:
    - docs/writing-style.md
    - docs/TERMS.md
```

pagebeam passes them to the model as they are. They come after pagebeam's own rules on how to answer and what not to invent, and they cannot override those rules.

If a listed file cannot be read, the run stops. Anyone who can commit to the repository can change these files. That is the same trust you already give to what CI runs.

## What leaves your machine

By default, pagebeam sends the docs page, the finding and its evidence.

Describing a control needs more than its name. With `sendSource: true`, pagebeam also sends the source files the controls were found in. That is your product's code, not its docs, so it is off unless you turn it on. The output names every file sent. A file that looks like it holds a credential is held back and reported instead.

```yaml
model:
  sendSource: false # the default
```

## What is refused

pagebeam refuses a draft that comes back unchanged, or shorter than half the page it was given. If the provider cannot answer, the finding stays as it was.

Every draft is marked as written by a model. A pull request that contains one opens as a draft. A fix worked out from the source says exactly what it replaces. A drafted page is a suggestion nobody has read yet. Set `propose.draft` to decide this yourself.
