const statusNode = document.getElementById("status");
const launchButton = document.getElementById("launch");

async function refreshStatus() {
  const status = await chrome.runtime.sendMessage({ type: "getBridgeStatus" });
  statusNode.textContent = JSON.stringify(
    {
      connected: status.connected,
      browserOpened: status.browserRunning,
      error: status.lastError
    },
    null,
    2
  );
}

launchButton.addEventListener("click", async () => {
  if (!statusNode.textContent.includes("\"connected\": true")) {
    await chrome.runtime.sendMessage({ type: "reconnectNativeHost" });
  }

  await chrome.runtime.sendMessage({ type: "launchBrowser" });
  setTimeout(refreshStatus, 500);
});

refreshStatus().catch((error) => {
  statusNode.textContent = String(error);
});
