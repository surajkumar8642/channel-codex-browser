export async function getActiveTabSnapshot() {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true
  });

  const tab = tabs[0];

  if (!tab) {
    throw new Error("No active tab found.");
  }

  return {
    id: tab.id ?? null,
    title: tab.title ?? "",
    url: tab.url ?? "",
    status: tab.status ?? "unknown"
  };
}
