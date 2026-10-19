import { app } from 'electron'
import { randomUUID } from 'crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import type { Note } from '../shared/types'

const MAX_TITLE_LENGTH = 120

function storePath(): string {
  return join(app.getPath('userData'), 'notes.json')
}

export function listNotes(): Note[] {
  const file = storePath()
  if (!existsSync(file)) return []
  return JSON.parse(readFileSync(file, 'utf8')) as Note[]
}

export function saveNote(input: Partial<Note>): Note {
  const title = (input.title ?? '').trim()
  if (!title) {
    throw new Error('Note title must not be empty')
  }
  if (title.length > MAX_TITLE_LENGTH) {
    throw new Error(`Note title is too long (${title.length} > ${MAX_TITLE_LENGTH})`)
  }

  const notes = listNotes()
  const note: Note = {
    id: input.id ?? randomUUID(),
    title,
    body: input.body ?? '',
    updatedAt: new Date().toISOString()
  }
  const next = [note, ...notes.filter((n) => n.id !== note.id)]

  mkdirSync(app.getPath('userData'), { recursive: true })
  writeFileSync(storePath(), JSON.stringify(next, null, 2))
  return note
}
