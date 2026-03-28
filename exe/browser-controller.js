const fs = require("node:fs");
const path = require("node:path");
const { spawn } = require("node:child_process");
const { chromium } = require("playwright");

const ROOT_DIR = __dirname;
const CHROME_EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const DEBUG_PORT = 9222;
const PROFILE_DIR = path.join(ROOT_DIR, ".controller-profile");
const STATE_PATH = path.join(ROOT_DIR, "controller-state.json");
const RESULT_PATH = path.join(ROOT_DIR, "controller-last-result.json");

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function readState() {
  if (!fs.existsSync(STATE_PATH)) {
    return null;
  }

  try {
    return JSON.parse(fs.readFileSync(STATE_PATH, "utf8"));
  } catch (_error) {
    return null;
  }
}

async function isControllerReachable() {
  try {
    const browser = await chromium.connectOverCDP(`http://127.0.0.1:${DEBUG_PORT}`);
    await browser.close();
    return true;
  } catch (_error) {
    return false;
  }
}

async function waitForController(timeoutMs = 15000) {
  const startedAt = Date.now();
  while (Date.now() - startedAt < timeoutMs) {
    if (await isControllerReachable()) {
      return true;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return false;
}

async function launchBrowser() {
  fs.mkdirSync(PROFILE_DIR, { recursive: true });

  if (await isControllerReachable()) {
    const state = {
      browserRunning: true,
      connected: true,
      port: DEBUG_PORT,
      profileDir: PROFILE_DIR,
      updatedAt: new Date().toISOString()
    };
    writeJson(STATE_PATH, state);
    return state;
  }

  const child = spawn(
    CHROME_EXE,
    [
      `--remote-debugging-port=${DEBUG_PORT}`,
      `--user-data-dir=${PROFILE_DIR}`,
      "--new-window",
      "about:blank"
    ],
    {
      detached: true,
      stdio: "ignore"
    }
  );

  child.unref();

  const ok = await waitForController();
  if (!ok) {
    throw new Error("Controlled Chrome did not start on the debugging port.");
  }

  const state = {
    browserRunning: true,
    connected: true,
    port: DEBUG_PORT,
    pid: child.pid,
    profileDir: PROFILE_DIR,
    updatedAt: new Date().toISOString()
  };
  writeJson(STATE_PATH, state);
  return state;
}

async function connectToPage() {
  const browser = await chromium.connectOverCDP(`http://127.0.0.1:${DEBUG_PORT}`);
  const context = browser.contexts()[0] || await browser.newContext();
  let page = context.pages().find((item) => !item.isClosed());
  if (!page) {
    page = await context.newPage();
  }
  return { browser, context, page };
}

async function getPageSnapshot(page) {
  return {
    title: await page.title(),
    url: page.url(),
    textPreview: (await page.locator("body").innerText().catch(() => "")).slice(0, 1000)
  };
}

async function waitForSelector(page, selector, timeout) {
  const locator = page.locator(selector).first();
  await locator.waitFor({ state: "visible", timeout });
  return locator;
}

async function tryLocatorClick(locator) {
  try {
    await locator.click({ timeout: 5000 });
    return true;
  } catch (_error) {
    try {
      await locator.click({ timeout: 5000, force: true });
      return true;
    } catch (_innerError) {
      return false;
    }
  }
}

async function clickUsingFallbacks(page, payload, timeout) {
  const selectors = [];

  if (payload.selector) {
    selectors.push(payload.selector);
  }
  if (Array.isArray(payload.fallbackSelectors)) {
    selectors.push(...payload.fallbackSelectors);
  }

  for (const selector of selectors) {
    try {
      const locator = await waitForSelector(page, selector, timeout);
      if (await tryLocatorClick(locator)) {
        return { strategy: "selector", value: selector };
      }
    } catch (_error) {
      // Try next candidate.
    }
  }

  if (payload.text) {
    const textLocators = [
      page.getByRole("button", { name: payload.text, exact: false }).first(),
      page.getByRole("link", { name: payload.text, exact: false }).first(),
      page.getByText(payload.text, { exact: false }).first()
    ];

    for (const locator of textLocators) {
      try {
        await locator.waitFor({ state: "visible", timeout: 3000 });
        if (await tryLocatorClick(locator)) {
          return { strategy: "text", value: payload.text };
        }
      } catch (_error) {
        // Try next candidate.
      }
    }
  }

  throw new Error("Could not find a clickable target.");
}

async function fillUsingFallbacks(page, payload, timeout) {
  const value = payload.text || "";

  if (payload.selector) {
    const locator = await waitForSelector(page, payload.selector, timeout);
    await locator.fill(value);
    return { strategy: "selector", value: payload.selector };
  }

  if (payload.label) {
    const locator = page.getByLabel(payload.label, { exact: false }).first();
    await locator.waitFor({ state: "visible", timeout });
    await locator.fill(value);
    return { strategy: "label", value: payload.label };
  }

  if (payload.placeholder) {
    const locator = page.getByPlaceholder(payload.placeholder, { exact: false }).first();
    await locator.waitFor({ state: "visible", timeout });
    await locator.fill(value);
    return { strategy: "placeholder", value: payload.placeholder };
  }

  throw new Error("Missing selector, label, or placeholder for typeText.");
}

async function runCommand(command, payload = {}) {
  const timeout = Number(payload.timeoutMs || 15000);

  if (command === "launchBrowser") {
    const state = await launchBrowser();
    writeJson(RESULT_PATH, state);
    return state;
  }

  const reachable = await isControllerReachable();
  if (!reachable) {
    throw new Error("Controlled browser is not running. Launch it first.");
  }

  const { browser, page } = await connectToPage();

  try {
    let result;

    if (command === "openUrl") {
      await page.goto(payload.url || "https://www.google.com", { waitUntil: "domcontentloaded" });
      result = await getPageSnapshot(page);
    } else if (command === "getPageText") {
      result = await getPageSnapshot(page);
    } else if (command === "typeText") {
      result = {
        ...(await getPageSnapshot(page)),
        fillStrategy: await fillUsingFallbacks(page, payload, timeout)
      };
    } else if (command === "clickElement") {
      result = {
        ...(await getPageSnapshot(page)),
        clickStrategy: await clickUsingFallbacks(page, payload, timeout)
      };
    } else if (command === "pressKey") {
      await page.keyboard.press(payload.key || "Enter");
      result = await getPageSnapshot(page);
    } else if (command === "waitFor") {
      if (payload.selector) {
        await waitForSelector(page, payload.selector, timeout);
      } else {
        await page.waitForTimeout(timeout);
      }
      result = await getPageSnapshot(page);
    } else if (command === "extractText") {
      const locator = await waitForSelector(page, payload.selector, timeout);
      result = {
        title: await page.title(),
        url: page.url(),
        selector: payload.selector,
        text: await locator.innerText()
      };
    } else if (command === "extractLinks") {
      result = {
        title: await page.title(),
        url: page.url(),
        links: await page.locator("a").evaluateAll((anchors) =>
          anchors.slice(0, 100).map((anchor) => ({
            text: anchor.textContent?.trim() || "",
            href: anchor.href || ""
          }))
        )
      };
    } else if (command === "scrollPage") {
      await page.mouse.wheel(0, Number(payload.amount || 800));
      await page.waitForTimeout(300);
      result = await getPageSnapshot(page);
    } else if (command === "submitForm") {
      await clickUsingFallbacks(page, {
        selector: payload.selector,
        fallbackSelectors: payload.fallbackSelectors || ["button[type='submit']", "input[type='submit']"],
        text: payload.text || "Submit"
      }, timeout);
      await page.waitForTimeout(1000);
      result = await getPageSnapshot(page);
    } else if (command === "status") {
      result = {
        browserRunning: true,
        ...(await getPageSnapshot(page))
      };
    } else {
      throw new Error(`Unsupported command: ${command}`);
    }

    writeJson(RESULT_PATH, result);
    return result;
  } finally {
    await browser.close();
  }
}

async function main() {
  const [, , command, ...args] = process.argv;

  if (!command) {
    throw new Error("Usage: node browser-controller.js <command> [json-payload]");
  }

  if (command === "status") {
    const reachable = await isControllerReachable();
    const state = {
      browserRunning: reachable,
      connected: reachable,
      port: DEBUG_PORT,
      profileDir: PROFILE_DIR,
      updatedAt: new Date().toISOString()
    };
    writeJson(STATE_PATH, state);
    process.stdout.write(`${JSON.stringify(state, null, 2)}\n`);
    return;
  }

  let payload = {};
  if (process.env.CONTROLLER_PAYLOAD) {
    payload = JSON.parse(process.env.CONTROLLER_PAYLOAD);
  } else if (args[0]) {
    payload = JSON.parse(args[0]);
  }

  const result = await runCommand(command, payload);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main().catch((error) => {
  const failure = {
    ok: false,
    error: error instanceof Error ? error.message : String(error)
  };
  writeJson(RESULT_PATH, failure);
  process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
  process.exit(1);
});
