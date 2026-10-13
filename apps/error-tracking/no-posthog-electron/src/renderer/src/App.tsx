import { useEffect, useState } from 'react'
import type { Note } from '../../shared/types'
import Editor from './components/Editor'
import NoteList from './components/NoteList'

function App(): React.JSX.Element {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [status, setStatus] = useState('')

  useEffect(() => {
    window.api.listNotes().then(setNotes)
  }, [])

  const selected = notes.find((n) => n.id === selectedId) ?? null

  async function save(note: Partial<Note>): Promise<void> {
    const saved = await window.api.saveNote(note)
    setNotes(await window.api.listNotes())
    setSelectedId(saved.id)
    setStatus('Saved')
  }

  async function exportNote(id: string): Promise<void> {
    const result = await window.api.exportNote(id)
    setStatus(`Exported ${result.bytes} bytes to ${result.path}`)
  }

  function create(): void {
    const draft: Note = {
      id: crypto.randomUUID(),
      title: 'Untitled',
      body: '',
      updatedAt: new Date().toISOString()
    }
    setNotes((current) => [draft, ...current])
    setSelectedId(draft.id)
  }

  return (
    <div className="layout">
      <NoteList notes={notes} selectedId={selectedId} onSelect={setSelectedId} onCreate={create} />
      <main>
        {selected ? (
          <Editor key={selected.id} note={selected} onSave={save} onExport={exportNote} />
        ) : (
          <p className="empty">Select a note or create a new one.</p>
        )}
        <footer>{status}</footer>
      </main>
    </div>
  )
}

export default App
