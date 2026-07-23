package com.sourcemapexamplern

import android.os.Handler
import android.os.Looper
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class NativeCrashTestModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "NativeCrashTest"

  // Posts to the main thread so the exception escapes React Native's
  // native-module call guards and crashes the app as a real uncaught
  // JVM exception (what PostHog's native crash autocapture records).
  @ReactMethod
  fun crash() {
    Handler(Looper.getMainLooper()).post {
      throw RuntimeException("PostHog native crash test (Android)")
    }
  }
}
