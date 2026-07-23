import ExpoModulesCore

public class NativeCrashTestModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NativeCrashTest")

    // fatalError aborts the process with SIGABRT, which PostHog's native
    // crash autocapture records via its signal handler. The report is
    // written to disk and uploaded on the next app launch.
    Function("crash") {
      fatalError("PostHog native crash test (iOS)")
    }
  }
}
