import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import type { ExportResult, Note } from '../shared/types'

// Custom APIs for renderer
const api = {
  listNotes: (): Promise<Note[]> => ipcRenderer.invoke('notes:list'),
  saveNote: (note: Partial<Note>): Promise<Note> => ipcRenderer.invoke('notes:save', note),
  exportNote: (id: string): Promise<ExportResult> => ipcRenderer.invoke('notes:export', id)
}

export type Api = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
