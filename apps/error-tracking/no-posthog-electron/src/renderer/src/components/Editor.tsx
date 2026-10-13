import { useState } from 'react'
import type { Note } from '../../../shared/types'

type Props = {
  note: Note
  onSave: (note: Partial<Note>) => void
  onExport: (id: string) => void
}

function readingTime(body: string): number {
  const words = body.split(/\s+/).filter(Boolean)
  if (words.length === 0) {
    throw new Error('Cannot compute reading time for an empty note')
  }
  return Math.ceil(words.length / 200)
}

function Editor({ note, onSave, onExport }: Props): React.JSX.Element {
  const [title, setTitle] = useState(note.title)
  const [body, setBody] = useState(note.body)
  const [minutes, setMinutes] = useState<number | null>(null)

  return (
    <section className="editor">
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={18} />
      <div className="toolbar">
        <button type="button" onClick={() => onSave({ id: note.id, title, body })}>
          Save
        </button>
        <button type="button" onClick={() => onExport(note.id)}>
          Export to Documents
        </button>
        <button type="button" onClick={() => setMinutes(readingTime(body))}>
          Reading time
        </button>
        {minutes !== null && <span>{minutes} min read</span>}
      </div>
    </section>
  )
}

export default Editor
