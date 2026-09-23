---
title: Coverage
description: How pagebeam reads an application, from its files and from a running copy, and what each can prove.
---

Reading files sees every control an application declares. Opening a running application sees what a user sees, including labels assembled at runtime and resolved from a catalogue, and only on the pages it is told to open.

Neither alone is enough, so pagebeam does both where it can, and a finding says which it rested on. Rendering can prove a control exists; it can never prove one is gone, because a page nobody opened shows nothing.

## Parsers

Vue, React, Svelte, Astro, HTML and server-side templates, each through that framework's own compiler. Anything else is searched as text and says so.

## Opening a running application

Give an application a `url` and the `routes` to open. If the pages need a signed-in user, name a script that signs in and a selector that confirms it worked:

```yaml
apps:
  - name: dashboard
    path: ../dashboard
    url: http://localhost:3000
    routes: ['/', '/settings']
    auth:
      script: ./.pagebeam/login.mjs
      confirm: 'text=Sign out'
```
