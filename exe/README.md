Executable area for desktop or CLI code.

Current runtime
- Node.js native messaging host
- Open-source transport: `native-messaging` by `simov`

Files
- `host.js`: native messaging host entry point
- `host.cmd`: Windows wrapper that launches the host
- `host-manifest.template.json`: Chrome native messaging manifest template
- `install-host.ps1`: generates and installs the manifest to the Chrome native messaging folder

First target
- wait for the extension to connect
- send a `getActiveTab` command
- log the structured result in `host.log`

Setup
- Load the extension from `../extension` in Chrome to get the extension ID
- Run `powershell -ExecutionPolicy Bypass -File .\install-host.ps1 <extension-id>`
- Reload the extension after the manifest is installed
