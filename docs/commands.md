Direct Codex Control

Purpose
- Codex calls `browser-controller.js` directly.
- No Chrome extension is required.

Launch browser
```powershell
Set-Location .\controller
node .\browser-controller.js launchBrowser
```

Status
```powershell
Set-Location .\controller
node .\browser-controller.js status
```

Open URL
```powershell
Set-Location .\controller
$env:CONTROLLER_PAYLOAD='{"url":"https://www.google.com"}'
node .\browser-controller.js openUrl
```

Type text
```powershell
Set-Location .\controller
$env:CONTROLLER_PAYLOAD='{"selector":"input[name=''custname'']","text":"Suraj Kumar"}'
node .\browser-controller.js typeText
```

Click element
```powershell
Set-Location .\controller
$env:CONTROLLER_PAYLOAD='{"selector":"input[type=''submit'']","fallbackSelectors":["button[type=''submit'']","button"]}'
node .\browser-controller.js clickElement
```

Submit form
```powershell
Set-Location .\controller
$env:CONTROLLER_PAYLOAD='{"text":"Submit"}'
node .\browser-controller.js submitForm
```

Read page text
```powershell
Set-Location .\controller
node .\browser-controller.js getPageText
```

Notes
- The controller reconnects to the same Chrome debugging port on every command.
- This is more reliable than a long-running file watcher.
