import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'

import './lib/posthog.client'

hydrateRoot(
  document,
  <StrictMode>
    <HydratedRouter />
  </StrictMode>
)
