function readMeta(name) {
  return document.querySelector(`meta[name="${name}"]`)?.content
}

function parseJsonMeta(name) {
  const value = readMeta(name)
  if (!value) return null

  try {
    return JSON.parse(value)
  } catch (_error) {
    return null
  }
}

function assetHostFromApiHost(host) {
  return host.replace(".i.posthog.com", "-assets.i.posthog.com")
}

function loadPostHog(host) {
  return new Promise((resolve, reject) => {
    if (window.posthog) {
      resolve(window.posthog)
      return
    }

    const script = document.createElement("script")
    script.async = true
    script.crossOrigin = "anonymous"
    script.src = `${assetHostFromApiHost(host)}/static/array.js`
    script.onload = () => resolve(window.posthog)
    script.onerror = () => reject(new Error("Failed to load PostHog"))
    document.head.appendChild(script)
  })
}

let initPromise

export async function initializePostHog() {
  const token = readMeta("posthog-project-token")
  const host = readMeta("posthog-host")

  if (!token || !host) return null
  if (window.posthog?.__fizzyInitialized) return window.posthog
  if (initPromise) return initPromise

  initPromise = loadPostHog(host).then((posthog) => {
    posthog.init(token, {
      api_host: host,
      person_profiles: "identified_only",
      capture_pageview: true,
      capture_pageleave: true,
      autocapture: true,
      persistence: "localStorage+cookie",
      session_recording: {
        maskAllInputs: true,
        maskInputOptions: {
          password: true
        }
      }
    })

    const distinctId = readMeta("posthog-distinct-id")
    const personProperties = parseJsonMeta("posthog-person-properties")

    if (distinctId) {
      posthog.identify(distinctId, personProperties || undefined)
    }

    posthog.__fizzyInitialized = true
    return posthog
  })

  return initPromise
}

export async function resetPostHog() {
  const posthog = await initializePostHog()
  posthog?.reset()
}
