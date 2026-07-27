import 'package:flutter/material.dart';
import 'package:posthog_flutter/posthog_flutter.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final config = PostHogConfig('phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA')
    ..host = 'https://internal-c.posthog.com'
    ..debug = true;
  config.errorTrackingConfig.captureFlutterErrors = true;
  config.errorTrackingConfig.capturePlatformDispatcherErrors = true;
  config.errorTrackingConfig.captureNativeExceptions = true;

  await Posthog().setup(config);

  runApp(const App());
}

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: Center(
          child: ElevatedButton(
            onPressed: () => Posthog().captureException(
              error: Exception('PostHog source maps test'),
              stackTrace: StackTrace.current,
            ),
            child: const Text('Throw'),
          ),
        ),
      ),
    );
  }
}
