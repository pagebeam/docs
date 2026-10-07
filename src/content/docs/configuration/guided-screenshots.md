---
title: Guided screenshots
description: Sign in as named accounts, follow journeys through a running app, and save screenshots with a manifest of where each element sits.
---

`pagebeam shoot` opens a running copy of your app, signs in as an account you name, follows the steps of a journey, and saves a screenshot wherever a step asks for one. Each screenshot comes with a manifest that says which account took it, at which address and size, and where the elements you asked it to focus on sit in the image.

Journeys live under `tours` in `pagebeam.config.yaml`.

```yaml
tours:
  targets:
    local: { url: http://localhost:3000 }
    staging: { url: https://staging.example.test }

  accounts:
    writer:
      purpose: a user with a few notes
      login:
        usernameEnv: NOTES_USER
        passwordEnv: NOTES_PASSWORD
        form: { url: /login, username: '#username', password: '#password', submit: 'button[type=submit]' }
      confirm: 'text=Sign out' # only a signed-in page shows this
      seed: { command: npm run seed:notes }
      requires:
        - goto: /notes
          count: { selector: li.note, min: 3 }
        - request: /api/me
          status: 200

    newcomer:
      purpose: somebody signing in for the first time
      login:
        form: { url: /login, username: '#username', password: '#password', submit: 'button[type=submit]' }
      confirm: 'text=Sign out'
      fresh: true # a new user for every run
      seed: { command: node scripts/new-user.mjs }

  journeys:
    write-a-note:
      account: writer
      viewports:
        - { name: desktop, width: 1280, height: 800 }
        - { name: phone, width: 390, height: 844, scale: 3 }
      steps:
        - goto: /notes
        - expect: { selector: li.note, text: Groceries }
        - shot: { name: notes, caption: Every note in one place, focus: ['#new'] }
        - click: '#new'
        - fill: { selector: '#title', value: Weekend plans }
        - select: { selector: '#kind', value: todo }
        - shot: { name: new-note, focus: ['#title'], fullPage: true }

    onboarding:
      account: newcomer
      steps:
        - goto: /notes
        - shot: { name: empty, caption: A new account starts empty }
```

Then set the two variables the `writer` account names and run:

```sh
npx pagebeam shoot --target local
```

## targets

Where the app runs, by name. `--target` picks one. Without it, pagebeam uses the target named `local`, or the first one listed.

## accounts

Who a journey signs in as. pagebeam signs each account in once per run and reuses that session for every journey of that account.

| Setting    | Meaning                                                                              |
| ---------- | ------------------------------------------------------------------------------------ |
| `purpose`  | What this account is for, in words. Required                                         |
| `login`    | How to sign in: a `form`, a `script`, or both. Required                              |
| `confirm`  | A selector only a signed-in page has. Required                                       |
| `fresh`    | `true` makes a new user with the seed on every run, for screens only a new user sees |
| `seed`     | The command that prepares this account, and the targets it may run on                |
| `requires` | Checks that must pass after signing in and before any journey starts                 |

### Signing in

`form` names the login page and the selectors of its username field, password field and submit button. The username and password come from the environment variables named in `usernameEnv` and `passwordEnv`, or from the seed for a fresh account. The config holds the names of the variables, never their values.

`script` is a module whose default export is given the page and the credentials, `{ username, password }`, and signs in on it. Use it for anything a form cannot do, such as a second factor. With both, the form is filled first and the script runs after it.

After signing in, pagebeam waits for `confirm`. If it never appears, the run stops with `account "writer" did not sign in`, so a login page that rejected the password is never saved as a screenshot of the product.

### Seeds

`seed.command` runs in a shell, in the folder you run pagebeam in. It is given `PAGEBEAM_TARGET` and `PAGEBEAM_TARGET_URL`.

A seed runs only on the targets in `seed.targets`. Without that list, it runs only on a target on this machine (`localhost` or `127.0.0.1`), never on a remote one.

For a fresh account, pagebeam runs the seed before signing in. The last line the seed prints must be the new user as JSON:

```json
{ "username": "new-user-1@example.test", "password": "a-generated-password" }
```

Anything printed before that line is ignored. For an account that is not fresh, pagebeam does not run the seed; it names it when the account is not ready.

### requires

Each check proves the account has what its journeys need. They run in order, after signing in.

| Check                                 | Passes when                                                     |
| ------------------------------------- | --------------------------------------------------------------- |
| `{ goto?, count: { selector, min } }` | At least `min` elements match `selector`                        |
| `{ goto?, text }`                     | `text` is shown                                                 |
| `{ request, status? }`                | A signed-in `GET` of `request` answers `status` (default `200`) |

`goto` opens a path first. A failed check stops the run before any screenshot, with one message that names the account, the check and the seed:

```text
account "writer" is not ready on target "local": requirement 1 (at least 3 of li.note at /notes) failed, found 0. Run the seed: npm run seed:notes
```

## journeys

The steps to follow, signed in as `account`. A journey starts at the target's address and runs once for each viewport. Without `viewports`, it runs once at 1440 by 900 at scale 2. `scale` is the device pixel ratio and defaults to `2`, so a 1280 by 800 viewport gives a 2560 by 1600 image.

Each step does exactly one thing:

| Step                                          | Does                                                         |
| --------------------------------------------- | ------------------------------------------------------------ |
| `goto: /path`                                 | Opens a path on the target                                   |
| `click: selector`                             | Clicks the first match                                       |
| `fill: { selector, value }`                   | Types `value`. Use `valueEnv` to take it from a variable     |
| `select: { selector, value }`                 | Picks an option in a `select`                                |
| `wait: selector` or `wait: 500`               | Waits for an element to show, or for milliseconds            |
| `expect: { selector, text? }`                 | Stops the run unless the element shows, with `text` if given |
| `shot: { name, caption?, focus?, fullPage? }` | Saves a screenshot                                           |

Steps run again for each viewport, so a step that creates something creates it once per viewport.

## Output

Screenshots go to `.pagebeam/shots`, or the folder given with `--out`:

```text
.pagebeam/shots/<target>/<journey>/01-notes.desktop.png
.pagebeam/shots/<target>/<journey>/01-notes.phone.png
.pagebeam/shots/<target>/<journey>/02-new-note.desktop.png
.pagebeam/shots/<target>/<journey>/manifest.json
```

Each run of a journey replaces that journey's screenshots and manifest. Every shot in the manifest records:

```json
{
  "file": "01-notes.desktop.png",
  "journey": "write-a-note",
  "step": 2,
  "name": "notes",
  "caption": "Every note in one place",
  "account": "writer",
  "url": "http://localhost:3000/notes",
  "viewport": { "name": "desktop", "width": 1280, "height": 800, "scale": 2 },
  "focus": [{ "selector": "#new", "x": 200, "y": 100, "width": 400, "height": 80 }],
  "sha": "3f1c2a9e..."
}
```

`step` counts from `0`. `focus` boxes are in image pixels, scale included, so they can be drawn straight onto the image. For a viewport shot, the first focus element is scrolled into view first. `sha` is the commit checked out in the folder you run pagebeam in, or `null` outside a git repository.

## Exit codes

| Code | Meaning                                                                                    |
| ---- | ------------------------------------------------------------------------------------------ |
| `0`  | Every journey was followed and saved                                                       |
| `1`  | An account did not sign in or is not ready, or a step failed                               |
| `2`  | Nothing was shot: no tours, an unknown target or journey, an unset variable, or no browser |

`shoot` needs Chrome or Chromium installed and the `playwright-core` package.
