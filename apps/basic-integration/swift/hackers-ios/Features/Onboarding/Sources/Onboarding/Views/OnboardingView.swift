//
//  OnboardingView.swift
//  Hackers
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import DesignSystem
import PostHog
import SwiftUI

public struct OnboardingView: View {
    private let onboardingData: OnboardingData
    private let onDismiss: () -> Void

    private func completeOnboarding() {
        PostHogSDK.shared.capture("onboarding_completed")
        onDismiss()
    }

    public init(onboardingData: OnboardingData, onDismiss: @escaping () -> Void) {
        self.onboardingData = onboardingData
        self.onDismiss = onDismiss
    }

    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                ScrollView {
                    VStack(spacing: 32) {
                        headerView
                        itemsList
                    }
                    .padding(.horizontal, 24)
                    .padding(.top, 16)
                }

                continueButton
                    .padding(.horizontal, 24)
                    .padding(.bottom, 24)
                    .padding(.top, 16)
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarBackButtonHidden()
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                        Button(action: completeOnboarding) {
                            Image(systemName: "xmark")
                                .font(.headline)
                        }
                        .foregroundStyle(AppColors.appTintColor)
                        .accessibilityLabel("Close")
                    }
                }
            }
    }

    private var headerView: some View {
        VStack(spacing: 12) {
            Text(onboardingData.title)
                .scaledFont(.largeTitle)
                .bold()
                .multilineTextAlignment(.center)
        }
    }

    private var itemsList: some View {
        LazyVStack(spacing: 24) {
            ForEach(onboardingData.items) { item in
                OnboardingItemView(item: item)
            }
        }
    }

    @ViewBuilder
    private var continueButton: some View {
        if #available(iOS 26.0, *) {
            Button(action: completeOnboarding) {
                Text("Continue")
                    .scaledFont(.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
            }
            .glassEffect(.regular.tint(AppColors.appTintColor))
        } else {
            Button(action: completeOnboarding) {
                Text("Continue")
                    .scaledFont(.headline)
                    .foregroundStyle(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 50)
                    .background(AppColors.appTintColor)
            }
            .clipShape(.rect(cornerRadius: 12))
            .buttonStyle(.plain)
        }
    }
}
