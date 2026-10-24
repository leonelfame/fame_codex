const test = require("node:test");
const assert = require("node:assert/strict");
const { checkForUpdates } = require("../electron/release-check.cjs");

const release = (version, extra = {}) => ({
  tag_name: `v${version}`, prerelease: version.includes("-"), draft: false,
  assets: [{ name: `fame-codex-${version}-win-x64.exe`, browser_download_url: `https://github.com/leonelfame/fame_codex/releases/download/v${version}/fame-codex-${version}-win-x64.exe` }], ...extra,
});
const check = (fetchJson, options = {}) => checkForUpdates({ currentVersion: "6.1.14-beta.2", platform: "win32", arch: "x64", includePrereleases: false, fetchJson, ...options });

test("stable checks report the published version without offering a downgrade", async () => {
  const result = await check(async url => { assert(url.endsWith("/releases/latest")); return release("5.0.21"); });
  assert.equal(result.status, "up-to-date");
  assert.equal(result.latestVersion, "5.0.21");
  assert.equal(result.downloadUrl, null);
});

test("Beta channel picks the highest version and ignores drafts and invalid tags", async () => {
  const result = await check(async url => {
    assert(url.endsWith("/releases?per_page=100"));
    return [release("6.1.14-beta.3"), release("6.1.14-beta.10"), release("6.2.0", { draft: true }), { tag_name: "nightly" }];
  }, { includePrereleases: true });
  assert.equal(result.latestVersion, "6.1.14-beta.10");
  assert.equal(result.status, "available");
  assert(result.downloadUrl.endsWith("beta.10-win-x64.exe"));
});

test("stable channel rejects prereleases including mislabeled tags", async () => {
  for (const value of [release("6.1.14-beta.3"), release("6.1.14-beta.3", { prerelease: false }), release("6.1.14", { draft: true })]) {
    await assert.rejects(check(async () => value), /No published releases/);
  }
});

test("missing platform asset offers the release page and does not invent a download", async () => {
  const result = await check(async () => release("6.1.14", { assets: [] }));
  assert.equal(result.status, "available");
  assert.equal(result.downloadUrl, null);
  assert.equal(result.releaseUrl, "https://github.com/leonelfame/fame_codex/releases/tag/v6.1.14");
});

test("checks reject untrusted download links and credential-bearing URLs", async () => {
  for (const url of ["https://example.com/update.exe", "https://user:secret@github.com/leonelfame/fame_codex/releases/download/v6.1.14/fame-codex-6.1.14-win-x64.exe"]) {
    const item = release("6.1.14"); item.assets[0].browser_download_url = url;
    await assert.rejects(check(async () => item), /URL/);
  }
});

test("network failures and invalid metadata can be followed by a successful retry", async () => {
  await assert.rejects(check(async () => { throw new Error("offline"); }), /offline/);
  await assert.rejects(check(async () => []), /invalid release metadata/);
  const result = await check(async () => release("6.1.14"));
  assert.equal(result.status, "available");
});

test("macOS manual downloads use the DMG installer", async () => {
  const value = release("6.1.14", { assets: [{ name: "fame-codex-6.1.14-mac-arm64.dmg", browser_download_url: "https://github.com/leonelfame/fame_codex/releases/download/v6.1.14/fame-codex-6.1.14-mac-arm64.dmg" }] });
  const result = await check(async () => value, { platform: "darwin", arch: "arm64" });
  assert(result.downloadUrl.endsWith(".dmg"));
});
