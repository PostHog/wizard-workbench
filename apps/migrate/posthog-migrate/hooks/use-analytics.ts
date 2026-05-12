"use client";

import amplitude from "@/amplitude";
import { useCallback, useRef, useSyncExternalStore } from "react";

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, unknown>;
  timestamp: number;
};

let eventLog: AnalyticsEvent[] = [];
const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot() {
  return eventLog;
}

function pushEvent(event: AnalyticsEvent) {
  eventLog = [...eventLog, event];
  for (const listener of listeners) {
    listener();
  }
}

export function useEventLog() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function useTrack() {
  const lastEventRef = useRef<string>("");

  return useCallback((name: string, properties?: Record<string, unknown>) => {
    // Dedupe rapid-fire identical events (optimistic update + real update)
    const key = `${name}:${JSON.stringify(properties)}`;
    if (lastEventRef.current === key) {
      return;
    }
    lastEventRef.current = key;
    setTimeout(() => {
      lastEventRef.current = "";
    }, 100);

    amplitude.track(name, properties);
    pushEvent({ name, properties, timestamp: Date.now() });
  }, []);
}
