#!/bin/bash
# Score a wizard run's output against the Flutter integration rubric.
# Usage: ./score-flutter.sh [run-label]
SRC="${APP_SRC:-apps/basic-integration/flutter/localsend/app}"
DST="${APP_DST:-/tmp/wizard-e2e-app}"
LABEL="${1:-run}"

c() { grep -rl "$1" "$2" 2>/dev/null | head -1; }
n() { grep -rn "$1" "$2" 2>/dev/null | wc -l | tr -d ' '; }
mark() { [ "$1" = "1" ] && echo "PASS" || echo "FAIL"; }

B1=$(grep -c "posthog_flutter: \^" "$DST/pubspec.yaml" 2>/dev/null || echo 0)
B4=$([ -n "$(grep -rl 'WidgetsFlutterBinding.ensureInitialized' "$DST/lib" 2>/dev/null)" ] && echo 1 || echo 0)
AND=$(grep -c "com.posthog.posthog.AUTO_INIT" "$DST/android/app/src/main/AndroidManifest.xml" 2>/dev/null || echo 0)
IOS=$(grep -c "com.posthog.posthog.AUTO_INIT" "$DST/ios/Runner/Info.plist" 2>/dev/null || echo 0)
MAC=$(grep -c "com.posthog.posthog.AUTO_INIT" "$DST/macos/Runner/Info.plist" 2>/dev/null || echo 0)
B5=$([ "$AND" -gt 0 ] && [ "$IOS" -gt 0 ] && [ "$MAC" -gt 0 ] && echo 1 || echo 0)
B6=$([ "$(n 'PosthogObserver' "$DST/lib")" -gt 0 ] && echo 1 || echo 0)
if [ -f "$DST/web/index.html" ]; then
  B7=$([ "$(grep -c posthog "$DST/web/index.html" 2>/dev/null || echo 0)" -gt 0 ] && echo 1 || echo 0)
else B7=n/a; fi
CAPS=$(n 'Posthog().capture' "$DST/lib")
B8=$([ "$CAPS" -gt 0 ] && echo 1 || echo 0)
GUARDS=$(n 'projectToken.isNotEmpty' "$DST/lib")
Q1=$([ "$GUARDS" -eq 0 ] && echo 1 || echo 0)
Q4=$([ "$(n 'inAppIncludes' "$DST/lib")" -gt 0 ] && echo 1 || echo 0)
FILES=$(diff -rq "$SRC" "$DST" 2>/dev/null | grep -vc "\.dart_tool\|build$\|\.claude\|\.posthog-wizard-cache")

echo "=== $LABEL ==="
echo "B1 sdk declared     : $(mark $B1)"
echo "B4 dart init        : $(mark $B4)"
echo "B5 auto-init off    : $(mark $B5)  (android=$AND ios=$IOS macos=$MAC)"
echo "B6 screen tracking  : $(mark $B6)"
echo "B7 web initialized  : $([ "$B7" = "n/a" ] && echo n/a || mark $B7)"
echo "B8 events captured  : $(mark $B8)  (captures=$CAPS)"
echo "Q1 no guard dupes   : $(mark $Q1)  (guards=$GUARDS)"
echo "Q4 error tracking   : $(mark $Q4)"
echo "   files changed    : $FILES"
BLOCK_FAIL=0
for v in $B1 $B4 $B5 $B6 $B8; do [ "$v" != "1" ] && BLOCK_FAIL=1; done
[ "$B7" != "n/a" ] && [ "$B7" != "1" ] && BLOCK_FAIL=1
echo "VERDICT: $([ $BLOCK_FAIL -eq 0 ] && echo 'PASS (blocking)' || echo 'FAIL (blocking)')"
