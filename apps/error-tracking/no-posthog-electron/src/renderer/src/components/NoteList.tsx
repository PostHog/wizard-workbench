import type { Note } from '../../../shared/types'

type Props = {
  notes: Note[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
}

function NoteList({ notes, selectedId, onSelect, onCreate }: Props): React.JSX.Element {
  return (
    <aside className="note-list">
      <button type="button" onClick={onCreate}>
        New note
      </button>
      <ul>
        {notes.map((note) => (
          <li
            key={note.id}
            className={note.id === selectedId ? 'selected' : undefined}
            onClick={() => onSelect(note.id)}
          >
            {note.title}
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default NoteList
