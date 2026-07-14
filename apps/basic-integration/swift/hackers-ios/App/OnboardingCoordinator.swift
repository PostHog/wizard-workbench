//
//  OnboardingCoordinator.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import Domain
import Foundation
import Onboarding
import PostHog
import SwiftUI

@MainActor
final class OnboardingCoordinator {
    private let onboardingUseCase: any OnboardingUseCase
    private let appVersion: String

    init(onboardingUseCase: any OnboardingUseCase, appVersion: String = Bundle.main.shortVersionString) {
        self.onboardingUseCase = onboardingUseCase
        self.appVersion = appVersion
    }

    func shouldShowOnboarding(forceShow: Bool = false) -> Bool {
        onboardingUseCase.shouldShowOnboarding(currentVersion: appVersion, forceShow: forceShow)
    }

    func markOnboardingShown() {
        onboardingUseCase.markOnboardingShown(for: appVersion)
        PostHogSDK.shared.capture("onboarding_completed", properties: [
            "app_version": appVersion
        ])
    }

    func makeOnboardingView(onDismiss: @escaping () -> Void) -> some View {
        Onboarding.OnboardingService.createOnboardingView {
            self.markOnboardingShown()
            onDismiss()
        }
    }
}

private extension Bundle {
    var shortVersionString: String {
        infoDictionary?["CFBundleShortVersionString"] as? String ?? "0"
    }
}
