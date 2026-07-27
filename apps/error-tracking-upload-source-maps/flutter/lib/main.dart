import 'package:flutter/material.dart';
import 'package:posthog_flutter/posthog_flutter.dart';

/// Minimal shell for the source-maps fixture: PostHog is set up with error
/// tracking on, and nothing else. The wizard adds the upload wiring and its
/// own temporary test affordance.
Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final config = PostHogConfig('phc_replaceMeWithYourProjectApiKey')
    ..host = 'https://us.i.posthog.com'
    ..debug = true;
  config.errorTrackingConfig.captureFlutterErrors = true;
  config.errorTrackingConfig.capturePlatformDispatcherErrors = true;
  // Required for the Android/iOS symbol uploads to have anything to
  // symbolicate — without it the native SDKs capture no crashes at all.
  config.errorTrackingConfig.captureNativeExceptions = true;

  await Posthog().setup(config);

  runApp(const SourceMapsFixtureApp());
}

class SourceMapsFixtureApp extends StatelessWidget {
  const SourceMapsFixtureApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Source maps fixture',
      home: Scaffold(
        appBar: AppBar(title: const Text('Source maps fixture')),
        body: const Center(child: Text('PostHog SDK installed.')),
      ),
    );
  }
}
