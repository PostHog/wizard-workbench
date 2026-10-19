import { ElectronAPI } from '@electron-toolkit/preload'
import type { ExportResult, Note } from '../shared/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      listNotes: () => Promise<Note[]>
      saveNote: (note: Partial<Note>) => Promise<Note>
      exportNote: (id: string) => Promise<ExportResult>
    }
  }
}
