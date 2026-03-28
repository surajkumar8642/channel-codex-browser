Direct Codex Control

Purpose
- The extension is only for the human launch step.
- After that, Codex should call `browser-controller.js` directly.

Launch browser
```powershell
node .\browser-controller.js launchBrowser
```

Status
```powershell
node .\browser-controller.js status
```

Open URL
```powershell
$env:CONTROLLER_PAYLOAD='{"url":"https://www.google.com"}'
node .\browser-controller.js openUrl
```

Type text
```powershell
$env:CONTROLLER_PAYLOAD='{"selector":"input[name=''custname'']","text":"Suraj Kumar"}'
node .\browser-controller.js typeText
```

Click element
```powershell
$env:CONTROLLER_PAYLOAD='{"selector":"input[type=''submit'']","fallbackSelectors":["button[type=''submit'']","button"]}'
node .\browser-controller.js clickElement
```

Submit form
```powershell
$env:CONTROLLER_PAYLOAD='{"text":"Submit"}'
node .\browser-controller.js submitForm
```

Read page text
```powershell
node .\browser-controller.js getPageText
```

Notes
- The controller reconnects to the same Chrome debugging port on every command.
- This is more reliable than a long-running file watcher.
