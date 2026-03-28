Chrome extension area for browser-side code.

Current files
- `manifest.json`: extension manifest
- `background.js`: native messaging bridge and command router
- `popup.html` and `popup.js`: debug popup for bridge status
- `fetchers/activeTab.js`: active tab URL and title fetcher

First target
- connect to the local native host
- receive a `getActiveTab` command
- return the active tab title and URL
