# Trailhead

Plan hikes and check trail conditions before you go. React + TypeScript, built with Vite.

## Requirements

- Node.js 20.19+ or 22.12+
- Corepack (`corepack enable`) — the Yarn version is pinned in `package.json`

This repo uses Yarn Plug'n'Play, so there is no `node_modules` folder. If your editor
cannot resolve imports, run `yarn dlx @yarnpkg/sdks vscode` once.

## Getting started

```bash
cp .env.example .env.local   # fill in the values
yarn install
yarn dev
```

## Scripts

| Command        | Description                          |
| -------------- | ------------------------------------ |
| `yarn dev`     | Start the dev server                 |
| `yarn build`   | Type-check and build into `dist/`    |
| `yarn preview` | Serve the production build locally   |
| `yarn lint`    | Run ESLint                           |

## Environment

| Variable                | Description              |
| ----------------------- | ------------------------ |
| `VITE_PH_PROJECT_TOKEN` | PostHog project token    |
| `VITE_PH_API_HOST`      | PostHog API host         |

## Deployment

`main` is deployed to GitHub Pages by `.github/workflows/deploy.yml`. The workflow sets
`BASE_PATH` to the repository name so assets resolve under the Pages sub-path.
