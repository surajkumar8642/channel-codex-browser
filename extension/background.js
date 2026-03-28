const NATIVE_HOST_NAME = "com.channel_codex.browser_host";

let nativePort = null;
let lastStatus = {
  connected: false,
  browserRunning: false,
  lastError: null,
  lastResult: null,
  lastMessage: null
};

function updateStatus(patch) {
  lastStatus = {
    ...lastStatus,
    ...patch
  };
}

function postToHost(message) {
  if (!nativePort) {
    updateStatus({ lastError: "Native host is not connected." });
    return false;
  }

  nativePort.postMessage(message);
  return true;
}

function handleHostMessage(message) {
  if (message.type === "hostStatus") {
    updateStatus({
      connected: true,
      browserRunning: Boolean(message.browserRunning),
      lastMessage: message.message || null,
      lastError: null
    });
    return;
  }

  if (message.type === "commandResult") {
    updateStatus({
      lastResult: message.ok ? message.result : null,
      lastError: message.ok ? null : message.error?.message || "Command failed."
    });
  }
}

function connectNativeHost() {
  try {
    nativePort = chrome.runtime.connectNative(NATIVE_HOST_NAME);

    nativePort.onMessage.addListener((message) => {
      handleHostMessage(message);
    });

    nativePort.onDisconnect.addListener(() => {
      const runtimeError = chrome.runtime.lastError?.message || "Native host disconnected.";
      nativePort = null;
      updateStatus({ connected: false, browserRunning: false, lastError: runtimeError });
    });

    updateStatus({ connected: true, lastError: null });
    postToHost({
      type: "extensionReady",
      extensionVersion: chrome.runtime.getManifest().version
    });
  } catch (error) {
    updateStatus({
      connected: false,
      browserRunning: false,
      lastError: error instanceof Error ? error.message : String(error)
    });
  }
}

function issueClientCommand(command, payload = {}) {
  const commandId = crypto.randomUUID();
  const ok = postToHost({
    type: "clientCommand",
    commandId,
    command,
    payload
  });

  if (!ok) {
    return { ok: false };
  }

  updateStatus({ lastMessage: `Sent command: ${command}` });
  return { ok: true, commandId };
}

chrome.runtime.onInstalled.addListener(() => {
  connectNativeHost();
});

chrome.runtime.onStartup.addListener(() => {
  connectNativeHost();
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === "getBridgeStatus") {
    sendResponse(lastStatus);
    return true;
  }

  if (message?.type === "reconnectNativeHost") {
    connectNativeHost();
    sendResponse({ ok: true });
    return true;
  }

  if (message?.type === "launchBrowser") {
    sendResponse(issueClientCommand("launchBrowser"));
    return true;
  }

  if (message?.type === "openUrl") {
    sendResponse(issueClientCommand("openUrl", { url: message.url }));
    return true;
  }

  if (message?.type === "getPageText") {
    sendResponse(issueClientCommand("getPageText"));
    return true;
  }

  if (message?.type === "runBrowserCommand") {
    sendResponse(issueClientCommand(message.command, message.payload || {}));
    return true;
  }

  return false;
});
