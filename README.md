# Channel Codex Browser

Shared browser automation for Codex plus human handoff.

## Architecture

This project uses a standalone controller:

- `exe/browser-controller.js`

It launches and reconnects to a Chrome instance through remote debugging.
The old Chrome extension and native messaging host flow are no longer required.

## Setup

From [`exe`](C:\Work\lerarn\VideoCreate\channel-codex-browser\exe):

```powershell
npm install
npx playwright install chromium
```

Launch the controlled browser:

```powershell
node .\browser-controller.js launchBrowser
```

Check status:

```powershell
node .\browser-controller.js status
```

## Example Commands

Open a URL:

```powershell
$env:CONTROLLER_PAYLOAD='{"url":"https://www.google.com"}'
node .\browser-controller.js openUrl
```

Type into a field:

```powershell
$env:CONTROLLER_PAYLOAD='{"selector":"textarea[name=''q'']","text":"suraj kumar"}'
node .\browser-controller.js typeText
```

Press Enter:

```powershell
$env:CONTROLLER_PAYLOAD='{"key":"Enter"}'
node .\browser-controller.js pressKey
```

Read page text:

```powershell
node .\browser-controller.js getPageText
```

## Workflow

1. Codex opens a page.
2. Human performs login, CAPTCHA, OTP, consent, or approval if needed.
3. Human replies `d` or another agreed signal.
4. Codex continues on the same browser session.

## Files

- [`exe/browser-controller.js`](C:\Work\lerarn\VideoCreate\channel-codex-browser\exe\browser-controller.js)
- [`exe/COMMANDS.md`](C:\Work\lerarn\VideoCreate\channel-codex-browser\exe\COMMANDS.md)
- [`to_do_manual.txt`](C:\Work\lerarn\VideoCreate\channel-codex-browser\to_do_manual.txt)
- [`sample_handoff_sites.txt`](C:\Work\lerarn\VideoCreate\channel-codex-browser\sample_handoff_sites.txt)
- [`test_plan.txt`](C:\Work\lerarn\VideoCreate\channel-codex-browser\test_plan.txt)
