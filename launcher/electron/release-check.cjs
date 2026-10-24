const { compareVersions, parseVersion, releaseVersion, releaseAssetName, validateReleaseAssetUrl } = require("./update.cjs");

const REPOSITORY_URL = "https://github.com/leonelfame/fame_codex";
const API_URL = "https://api.github.com/repos/leonelfame/fame_codex/releases";

async function checkForUpdates({ currentVersion, includePrereleases, platform, arch, fetchJson }) {
  const response = await fetchJson(includePrereleases ? `${API_URL}?per_page=100` : `${API_URL}/latest`);
  if (includePrereleases ? !Array.isArray(response) : !response || typeof response !== "object" || Array.isArray(response)) {
    throw new Error("GitHub returned invalid release metadata. Try again later.");
  }
  const releases = (includePrereleases ? response : [response]).filter(release => {
    if (!release || typeof release !== "object" || release.draft === true) return false;
    const version = typeof release.tag_name === "string" ? parseVersion(release.tag_name.replace(/^v/, "")) : null;
    return version && (includePrereleases || (!release.prerelease && version.prerelease === null));
  });
  releases.sort((a, b) => compareVersions(releaseVersion(b.tag_name), releaseVersion(a.tag_name)));
  const release = releases[0];
  if (!release) throw new Error("No published releases were found for this channel.");
  const latestVersion = releaseVersion(release.tag_name);
  const releaseUrl = `${REPOSITORY_URL}/releases/tag/${encodeURIComponent(release.tag_name)}`;
  const newer = compareVersions(latestVersion, currentVersion) > 0;
  let downloadUrl = null;
  if (newer) {
    const assetName = releaseAssetName(latestVersion, platform, arch)?.replace(/\.zip$/, ".dmg");
    const asset = Array.isArray(release.assets) ? release.assets.find(item => item?.name === assetName) : null;
    if (asset?.browser_download_url) {
      const url = new URL(asset.browser_download_url);
      if (url.username || url.password) throw new Error("GitHub returned an invalid download URL");
      downloadUrl = validateReleaseAssetUrl(asset.browser_download_url, latestVersion, assetName);
    }
  }
  return { status: newer ? "available" : "up-to-date", latestVersion, releaseUrl, downloadUrl };
}

module.exports = { checkForUpdates };
