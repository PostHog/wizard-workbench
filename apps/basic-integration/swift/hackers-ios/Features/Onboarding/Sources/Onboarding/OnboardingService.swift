//
//  OnboardingService.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import PostHog
import SwiftUI

@MainActor
public enum OnboardingService {
    public static func createOnboardingView(
        onDismiss: @escaping () -> Void,
    ) -> some View {
        let onboardingData = OnboardingData.currentOnboarding()
        return OnboardingView(onboardingData: onboardingData, onDismiss: {
            PostHogSDK.shared.capture("onboarding_completed")
            onDismiss()
        })
    }
}
