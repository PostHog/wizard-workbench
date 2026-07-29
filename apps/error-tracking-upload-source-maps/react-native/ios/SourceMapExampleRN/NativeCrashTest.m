#import <React/RCTBridgeModule.h>

// Test-only module: crashes the app natively so PostHog's native crash
// autocapture + dSYM symbolication can be verified end to end.
@interface NativeCrashTest : NSObject <RCTBridgeModule>
@end

@implementation NativeCrashTest

RCT_EXPORT_MODULE();

// Dispatches to the main queue so the exception escapes React Native's
// native-module call guards and takes the process down as a real uncaught
// NSException. The crash report uploads on the NEXT app launch.
RCT_EXPORT_METHOD(crash)
{
  dispatch_async(dispatch_get_main_queue(), ^{
    [NSException raise:@"PostHogNativeCrashTest" format:@"PostHog native crash test (iOS)"];
  });
}

@end
