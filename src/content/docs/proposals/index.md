---
title: Proposals
description: How pagebeam drafts fixes with a model you choose, what it sends, and what it refuses.
---

A check can prove a page is wrong without being able to say what it should say instead. Name a provider and each of those findings is put to it once, with the page and the evidence already gathered.

Any endpoint answering the OpenAI chat completions shape works: a provider's own address, a gateway in front of several, or a router on this machine. pagebeam ships no provider code and never sees a key, only the name of the variable holding one. Use `headers` where a provider wants more than a bearer token, and `enrich: false` to keep the provider configured and stop asking it.

Proposals are made by `pagebeam fix`. `pagebeam check` never asks a model.

## Skills

Point `skills` at whatever the project already keeps for the people who write its documentation. pagebeam does not read them or decide what counts: they are given to the model as they are, after the rules about how it must answer and what it may not invent, which they cannot displace.

```yaml
model:
  skills:
    - docs/writing-style.md
    - docs/TERMS.md
```

A file named here that cannot be read stops the run. Anyone who can commit to the repository can change what these say, which is the same trust you already place in what CI runs.

## What leaves this machine

By default: the documentation page, the finding, and the evidence for it.

Describing a control needs more than its name, so `sendSource: true` also sends the source the controls were found in. That is the product itself rather than its documentation, so it is off until you say otherwise. Every file sent is named in the run's output, and one that looks like it holds a credential is held back and reported rather than sent.

```yaml
model:
  sendSource: false # the default
```

## What is refused

A draft that comes back unchanged, or shorter than half the page it was given, is refused rather than proposed. A provider that cannot answer leaves the finding exactly as it was.

Every draft is marked as written by a model. A pull request containing one opens as a draft, because a change worked out from the source says exactly what it replaces and expects to find, while a drafted page is a suggestion about prose nobody has read yet. Set `propose.draft` to decide it yourself.
