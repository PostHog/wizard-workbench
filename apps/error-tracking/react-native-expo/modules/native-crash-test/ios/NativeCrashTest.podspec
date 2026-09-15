Pod::Spec.new do |s|
  s.name           = 'NativeCrashTest'
  s.version        = '1.0.0'
  s.summary        = 'Throws a native crash to verify PostHog symbolication'
  s.description    = 'Test-only local Expo module: crashes the app natively on demand'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }

  s.source_files = '**/*.{h,m,mm,swift,hpp,cpp}'
end
