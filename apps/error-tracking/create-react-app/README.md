# Pantry

A small meal planner: browse recipes and keep a shopping list.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Setup

```bash
cp .env.example .env.local   # fill in the values
npm install
npm start
```

The app runs at http://localhost:3000.

## Scripts

- `npm start` — dev server with hot reload
- `npm test` — Jest in watch mode
- `npm run build` — production build into `build/`

## Configuration

| Variable                 | Purpose                    |
| ------------------------ | -------------------------- |
| `REACT_APP_POSTHOG_KEY`  | PostHog project API key    |
| `REACT_APP_POSTHOG_HOST` | PostHog API host           |

## Deployment

The site is hosted on Netlify (`netlify.toml`). Pushes to `main` are built and deployed by
`.github/workflows/deploy.yml`; pull requests get a preview deploy.
