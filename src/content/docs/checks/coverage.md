---
title: Coverage
description: How pagebeam reads an application, from its files and from a running copy, and what each can prove.
---

Reading files shows every control the application declares. Opening a running copy shows what a user sees, including labels built at runtime. It shows only the pages you tell it to open.

pagebeam does both where it can, and each finding says which one it used. A running copy can prove a control exists. It cannot prove one is gone, because a page nobody opened shows nothing.

## Parsers

pagebeam reads Vue, React, Svelte, Astro, HTML and server templates with each framework's own compiler. It searches anything else as plain text, and the finding says so.

## Opening a running application

Give the application a `url` and the `routes` to open. If the pages need a signed-in user, give a script that signs in and a selector that shows it worked:

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
