# Markpad

A small Markdown notes app for the desktop, built with Electron, React and TypeScript
([electron-vite](https://electron-vite.org)).

Notes are stored as JSON in the app's user data folder and can be exported as `.md`
files to your Documents folder.

## Project layout

```
src/main       Electron main process (window, IPC handlers, note storage)
src/preload    Preload script; exposes `window.api` to the renderer
src/renderer   React UI
src/shared     Types shared by all three
```

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build          # type-check and bundle into out/
npm run build:mac      # package for macOS
npm run build:win      # package for Windows
npm run build:linux    # package for Linux
```

## Releases

Pushing a `v*` tag runs `.github/workflows/deploy.yml`, which packages the app on macOS,
Windows and Linux runners and uploads the installers to a draft GitHub release.
