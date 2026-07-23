package expo.modules.nativecrashtest

import android.os.Handler
import android.os.Looper
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class NativeCrashTestModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NativeCrashTest")

    // Posts to the main thread so the exception escapes React Native's
    // native-module call guards and crashes the app as a real uncaught
    // JVM exception (what PostHog's native crash autocapture records).
    Function("crash") {
      Handler(Looper.getMainLooper()).post {
        throw RuntimeException("PostHog native crash test (Android)")
      }
    }
  }
}
