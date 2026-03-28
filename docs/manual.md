Channel Codex Browser - Manual Steps

Condition
- Codex is already installed and running on this PC

What changed
- This project no longer needs the Chrome extension
- This project no longer needs the native messaging host
- Browser control now happens directly through `controller/browser-controller.js`

What only you do

1. Open PowerShell in:
   `C:\Work\lerarn\VideoCreate\channel-codex-browser\controller`
2. Run:
   `npm install`
3. Run:
   `npx playwright install chromium`
4. If Codex asks for a browser launch, allow it or run:
   `node .\browser-controller.js launchBrowser`

Manual-only tasks
- log in to websites
- solve CAPTCHA
- enter OTP
- accept consent prompts
- approve sensitive actions
- do any step you want to keep manual

How to work with Codex

1. Codex opens the target URL
2. You do the human-only step if needed
3. Tell Codex to continue
4. Codex continues in the same browser session

Useful one-letter replies
- `r` = browser ready
- `d` = manual step done

Useful files
- Controller guide:
  `C:\Work\lerarn\VideoCreate\channel-codex-browser\docs\commands.md`
- Controller code:
  `C:\Work\lerarn\VideoCreate\channel-codex-browser\controller\browser-controller.js`
- Last controller result:
  `C:\Work\lerarn\VideoCreate\channel-codex-browser\controller\controller-last-result.json`
- Controller state:
  `C:\Work\lerarn\VideoCreate\channel-codex-browser\controller\controller-state.json`
