import { useEffect, useRef, useState } from "react";
import type { LimitsApi, LimitsSnapshot, LimitsWindow } from "./limits-types";

export function limitNeedsAttention(window: LimitsWindow): boolean {
  return window.limit > 0 && window.used >= window.limit * 0.75;
}

// One reader keeps the page and sidebar in sync, including while Limits is closed.
export function useLimits(api: LimitsApi, manualMode: boolean, active = false) {
  const [snapshot, setSnapshot] = useState<LimitsSnapshot | null>(null);
  const [reading, setReading] = useState(true);
  const [settingUp, setSettingUp] = useState(false);
  const [readError, setReadError] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [refreshVersion, setRefreshVersion] = useState(0);
  const mounted = useRef(false);
  const setupInFlight = useRef(false);
  const requestVersion = useRef(0);
  const refresh = () => setRefreshVersion((value) => value + 1);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      requestVersion.current += 1;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let inFlight = false;
    let timer: ReturnType<typeof setTimeout>;
    const read = async () => {
      if (cancelled || inFlight) return;
      clearTimeout(timer);
      if (document.hidden) return;
      inFlight = true;
      if (!setupInFlight.current) {
        const version = requestVersion.current;
        setReading(true);
        try {
          const next = await api.getLimits();
          if (!cancelled && version === requestVersion.current) {
            setSnapshot(next);
            setReadError(null);
          }
        } catch (cause) {
          if (!cancelled && version === requestVersion.current) setReadError(errorMessage(cause));
        } finally {
          if (!cancelled) setReading(false);
        }
      }
      inFlight = false;
      if (!cancelled && !document.hidden && !manualMode) timer = setTimeout(() => void read(), active ? 10_000 : 60_000);
    };
    const onVisibilityChange = () => {
      if (document.hidden) clearTimeout(timer);
      else void read();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    void read();
    return () => {
      cancelled = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [api, manualMode, active, refreshVersion]);

  const setup = async () => {
    if (manualMode || !snapshot || setupInFlight.current) return null;
    setupInFlight.current = true;
    const version = ++requestVersion.current;
    setSettingUp(true);
    setSetupError(null);
    try {
      const next = await api.setupLimits();
      if (!mounted.current || version !== requestVersion.current) return null;
      setSnapshot(next);
      setReadError(null);
      return next;
    } catch (cause) {
      if (mounted.current && version === requestVersion.current) setSetupError(errorMessage(cause));
      throw cause;
    } finally {
      setupInFlight.current = false;
      if (mounted.current && version === requestVersion.current) {
        setSettingUp(false);
        refresh();
      }
    }
  };

  const needsAttention = !manualMode && readError === null && snapshot?.enabled === true
    && snapshot.disabledReason !== "zero-risk"
    && (snapshot.plan === "pro_100" || snapshot.plan === "pro_200")
    && snapshot.windows.some(limitNeedsAttention);

  return { snapshot, reading, settingUp, readError, setupError, refresh, setup, needsAttention };
}

export type LimitsTracker = ReturnType<typeof useLimits>;

function errorMessage(cause: unknown): string {
  return cause instanceof Error ? cause.message : String(cause ?? "");
}
