# Channel Codex Browser

Shared browser automation for Codex plus human handoff.

## Structure

- `controller/`
  runtime code and npm package
- `docs/`
  manual, commands, tests, and project notes

## Architecture

This project uses a standalone controller at `controller/browser-controller.js`.
It launches and reconnects to a Chrome instance through remote debugging.

## Setup

From the `controller` folder:

```powershell
cd .\controller
npm install
npx playwright install chromium
```

Launch the controlled browser:

```powershell
node .\browser-controller.js launchBrowser
```

List available commands:

```powershell
node .\browser-controller.js help
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

You can also pass a plain domain and the controller will normalize it:

```powershell
$env:CONTROLLER_PAYLOAD='{"url":"google.com"}'
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

## Notes

- Set `CHANNEL_CODEX_BROWSER_PATH` if Chrome is installed outside the default Windows path.
- Invalid URLs now fail with a clear controller error instead of a browser navigation error.

## Files

- [`controller/browser-controller.js`](C:\Work\lerarn\VideoCreate\channel-codex-browser\controller\browser-controller.js)
- [`docs/commands.md`](C:\Work\lerarn\VideoCreate\channel-codex-browser\docs\commands.md)
- [`docs/manual.md`](C:\Work\lerarn\VideoCreate\channel-codex-browser\docs\manual.md)
- [`docs/sample-handoff-sites.md`](C:\Work\lerarn\VideoCreate\channel-codex-browser\docs\sample-handoff-sites.md)
- [`docs/test-plan.md`](C:\Work\lerarn\VideoCreate\channel-codex-browser\docs\test-plan.md)
