import { app, ipcMain } from 'electron'
import { writeFileSync } from 'fs'
import { join } from 'path'
import { listNotes, saveNote } from './notes-store'
import type { ExportResult, Note } from '../shared/types'

export function registerIpcHandlers(): void {
  ipcMain.handle('notes:list', () => listNotes())

  ipcMain.handle('notes:save', (_event, note: Partial<Note>) => saveNote(note))

  ipcMain.handle('notes:export', (_event, id: string): ExportResult => {
    const note = listNotes().find((n) => n.id === id)
    if (!note) {
      throw new Error(`Cannot export note ${id}: not found`)
    }

    const safeName = note.title.replace(/[^\w.-]+/g, '_')
    if (safeName.startsWith('.')) {
      throw new Error(`Refusing to export note with hidden file name "${safeName}"`)
    }

    const path = join(app.getPath('documents'), `${safeName}.md`)
    const contents = `# ${note.title}\n\n${note.body}\n`
    writeFileSync(path, contents)
    return { path, bytes: Buffer.byteLength(contents) }
  })
}
