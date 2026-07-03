//
//  SettingsViewModel.swift
//  Settings
//
//  Copyright © 2025 Weiran Zhang. All rights reserved.
//

import Domain
import Foundation
import Observation
import PostHog
import Shared

@MainActor
@Observable
public final class SettingsViewModel: @unchecked Sendable {
    private var settingsUseCase: any SettingsUseCase
    private var hasLoadedSettings = false

    public var safariReaderMode: Bool = false {
        didSet { propagateChangesIfNeeded(\.safariReaderMode, safariReaderMode) }
    }

    public var openInDefaultBrowser: Bool = false {
        didSet { propagateChangesIfNeeded(\.openInDefaultBrowser, openInDefaultBrowser) }
    }

    public var showThumbnails: Bool = true {
        didSet { propagateChangesIfNeeded(\.showThumbnails, showThumbnails) }
    }

    public var rememberFeedCategory: Bool = false {
        didSet { propagateChangesIfNeeded(\.rememberFeedCategory, rememberFeedCategory) }
    }

    public var textSize: TextSize = .medium {
        didSet { propagateChangesIfNeeded(\.textSize, textSize) }
    }

    public var compactFeedDesign: Bool = false {
        didSet { propagateChangesIfNeeded(\.compactFeedDesign, compactFeedDesign) }
    }

    public var cacheUsageText: String = "Calculating…"

    public init(settingsUseCase: any SettingsUseCase = DependencyContainer.shared.getSettingsUseCase()) {
        self.settingsUseCase = settingsUseCase
        loadSettings()
        refreshCacheUsage()
    }

    private func loadSettings() {
        safariReaderMode = settingsUseCase.safariReaderMode
        openInDefaultBrowser = settingsUseCase.openInDefaultBrowser
        showThumbnails = settingsUseCase.showThumbnails
        rememberFeedCategory = settingsUseCase.rememberFeedCategory
        textSize = settingsUseCase.textSize
        compactFeedDesign = settingsUseCase.compactFeedDesign

        hasLoadedSettings = true
    }

    private func propagateChangesIfNeeded<Value>(_ keyPath: KeyPath<SettingsViewModel, Value>, _ value: Value) {
        guard hasLoadedSettings else { return }
        var settingName: String?
        switch keyPath {
        case \.safariReaderMode:
            settingsUseCase.safariReaderMode = value as! Bool
            settingName = "safari_reader_mode"
        case \.openInDefaultBrowser:
            settingsUseCase.openInDefaultBrowser = value as! Bool
            settingName = "open_in_default_browser"
        case \.showThumbnails:
            settingsUseCase.showThumbnails = value as! Bool
            settingName = "show_thumbnails"
        case \.rememberFeedCategory:
            settingsUseCase.rememberFeedCategory = value as! Bool
            settingName = "remember_feed_category"
        case \.textSize:
            settingsUseCase.textSize = value as! TextSize
            settingName = "text_size"
        case \.compactFeedDesign:
            settingsUseCase.compactFeedDesign = value as! Bool
            settingName = "compact_feed_design"
        default:
            break
        }
        if let settingName {
            PostHogSDK.shared.capture("setting_changed", properties: ["setting": settingName])
        }
    }

    // User actions
    public func clearCache() {
        settingsUseCase.clearCache()
        refreshCacheUsage()
    }

    public func refreshCacheUsage() {
        Task { [weak self] in
            guard let self else { return }
            let bytes = await settingsUseCase.cacheUsageBytes()
            let formatted = ByteCountFormatter.string(fromByteCount: bytes, countStyle: .file)
            await MainActor.run { self.cacheUsageText = formatted }
        }
    }
}
