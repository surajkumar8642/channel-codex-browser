const fs = require("node:fs");
const path = require("node:path");
const { execFile } = require("node:child_process");
const createNativeBridge = require("native-messaging");

const LOG_PATH = path.join(__dirname, "host.log");
const CONTROLLER_PATH = path.join(__dirname, "browser-controller.js");

let sendMessage = null;

function log(message, data) {
  const line = `[${new Date().toISOString()}] ${message}${
    data === undefined ? "" : ` ${JSON.stringify(data)}`
  }\n`;
  fs.appendFileSync(LOG_PATH, line);
}

function send(message) {
  if (!sendMessage) {
    return;
  }

  try {
    sendMessage(message);
  } catch (error) {
    log("send_failed", { error: error instanceof Error ? error.message : String(error) });
    sendMessage = null;
  }
}

function runController(command, payload = {}) {
  return new Promise((resolve, reject) => {
    execFile(
      process.execPath,
      [CONTROLLER_PATH, command, JSON.stringify(payload)],
      { cwd: __dirname, timeout: 60000 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(stderr || error.message));
          return;
        }

        try {
          resolve(JSON.parse(stdout));
        } catch (parseError) {
          reject(parseError);
        }
      }
    );
  });
}

async function publishStatus(message = "Host connected.") {
  try {
    const status = await runController("status");
    send({
      type: "hostStatus",
      connected: true,
      browserRunning: Boolean(status.browserRunning),
      message
    });
  } catch (error) {
    send({
      type: "hostStatus",
      connected: true,
      browserRunning: false,
      message: error instanceof Error ? error.message : String(error)
    });
  }
}

async function handleMessage(message) {
  log("received", message);

  if (message.type === "extensionReady") {
    await publishStatus();
    return;
  }

  if (message.type === "clientCommand") {
    try {
      const result = await runController(message.command, message.payload || {});
      send({
        type: "commandResult",
        commandId: message.commandId || `cmd-${Date.now()}`,
        ok: true,
        result
      });
      await publishStatus(`Executed: ${message.command}`);
    } catch (error) {
      send({
        type: "commandResult",
        commandId: message.commandId || `cmd-${Date.now()}`,
        ok: false,
        error: {
          code: "COMMAND_FAILED",
          message: error instanceof Error ? error.message : String(error)
        }
      });
      await publishStatus("Command failed.");
    }
  }
}

sendMessage = createNativeBridge((message) => {
  Promise.resolve(handleMessage(message)).catch((error) => {
    log("async_handler_error", { error: error.stack || String(error) });
  });
});

log("host_started");
