import { useState } from "react";
import type { Language, LauncherApi, LauncherState, ReleaseCheckResult } from "./types";
import { updatesCopyFor } from "./updates-copy";

type CheckState =
  | { status: "idle" | "checking" }
  | { status: "complete"; result: ReleaseCheckResult }
  | { status: "error"; message: string };

export function UpdatesSettings({ api, language, version, includeBeta, updateState }: {
  api: Pick<LauncherApi, "checkForUpdates" | "setPreference" | "openUpdateRelease">;
  language: Language;
  version: string;
  includeBeta: boolean;
  updateState: (state: LauncherState) => void;
}) {
  const copy = updatesCopyFor(language);
  const [check, setCheck] = useState<CheckState>({ status: "idle" });
  const [saving, setSaving] = useState(false);
  const busy = saving || check.status === "checking";
  const checkNow = async () => {
    setCheck({ status: "checking" });
    try { setCheck({ status: "complete", result: await api.checkForUpdates() }); }
    catch { setCheck({ status: "error", message: copy.failed }); }
  };
  const changeChannel = async (enabled: boolean) => {
    setSaving(true);
    setCheck({ status: "idle" });
    try { updateState(await api.setPreference("includePrereleaseUpdates", enabled)); }
    catch { setCheck({ status: "error", message: copy.failed }); }
    finally { setSaving(false); }
  };
  const openRelease = async () => {
    try { if (!await api.openUpdateRelease()) throw new Error("Browser did not open"); }
    catch { setCheck({ status: "error", message: copy.failed }); }
  };
  return <section aria-label={copy.title} className="updates-settings">
    <div className="section-heading is-spaced"><h2>{copy.title}</h2></div>
    <div className="setting-row">
      <div><strong>{copy.installed}</strong><p>v{version}</p></div>
      <button className="button-secondary" disabled={busy} onClick={() => void checkNow()} type="button">
        {check.status === "checking" ? copy.checking : copy.check}
      </button>
    </div>
    <label className="updates-channel">
      <input checked={includeBeta} disabled={busy} onChange={event => void changeChannel(event.target.checked)} type="checkbox" />
      {copy.beta}
    </label>
    <div aria-live="polite" aria-atomic="true" className="updates-result">
      {check.status === "error" ? <p role="alert">{check.message}</p> : null}
      {check.status === "complete" ? <>
        <p>{copy.latest}: <strong>v{check.result.latestVersion}</strong></p>
        <p>{check.result.status === "available" ? copy.available : copy.current}</p>
        <button className="button-secondary" onClick={() => void openRelease()} type="button">
          {check.result.downloadUrl ? copy.download : copy.releases}
        </button>
      </> : null}
    </div>
    <p className="updates-hint">{copy.hint}</p>
  </section>;
}
