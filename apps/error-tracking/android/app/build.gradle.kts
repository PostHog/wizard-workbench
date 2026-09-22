plugins {
    id("com.android.application")
}

android {
    namespace = "com.posthog.sourcemapexample"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.posthog.sourcemapexample"
        minSdk = 24
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro",
            )
            // Debug-signed so `./gradlew installRelease` works without a keystore.
            signingConfig = signingConfigs.getByName("debug")
        }
    }
}

dependencies {
    implementation("com.posthog:posthog-android:3.55.2")
}
