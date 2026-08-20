import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { BookCourt } from './routes/BookCourt'
import { Confirmation } from './routes/Confirmation'
import { Courts } from './routes/Courts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Courts />} />
        <Route path="/book/:courtId" element={<BookCourt />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
