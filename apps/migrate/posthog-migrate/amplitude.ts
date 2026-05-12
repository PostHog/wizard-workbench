"use client";

import * as amplitude from "@amplitude/unified";
import { useEffect } from "react";

const apiKey = process.env.NEXT_PUBLIC_AMPLITUDE_API_KEY ?? "dd7ef6a2bc0bba2f5a0e3cad91acf193";

let initialized = false;

function initAmplitude() {
  if (typeof window === "undefined" || initialized || !apiKey) {
    return;
  }

  initialized = true;
  amplitude.initAll(apiKey, {
    analytics: { autocapture: true },
    sessionReplay: { sampleRate: 1 },
  });
}

export function Amplitude() {
  useEffect(() => {
    initAmplitude();
  }, []);

  return null;
}

export default amplitude;
