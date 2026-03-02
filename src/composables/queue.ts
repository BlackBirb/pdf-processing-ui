import { inject, provide, ref, shallowRef, unref, type MaybeRef, type Ref } from "vue"

type QueueItem = {
  progress: number,
  file: File,
  result: Blob | null,
  url?: string,
  done: boolean,
  error: boolean
}

type QueueContext = {
  addFiles: (files: File[]) => void,
  removeFile: (file: File) => void,
  processQueue: () => void,
  items: QueueItem[]
}

const downloadUrl = (url: string, filename: string) => {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const injectionKey = Symbol('queue')
export const provideQueue = (token: MaybeRef<string>, preset: MaybeRef<string>) => {
  const stagingFiles = ref<QueueItem[]>([])

  const addFiles = (files: File[]) => {
    if(files.length < 1) return

    const existingFileNames = stagingFiles.value.map(f => f.file.name)
    const newFiles = files.filter(f => !existingFileNames.includes(f.name) && f.type === 'application/pdf')

    stagingFiles.value = [
      ...stagingFiles.value,
      ...newFiles.map(f => ({
        file: f,
        progress: 0,
        result: null,
        done: false,
        error: false
      }) satisfies QueueItem)
    ]
    processQueue()
  }

  const removeFile = (file: File) => {
    stagingFiles.value = stagingFiles.value.filter(f => f.file.name !== file.name)
  }

  let processing = false
  const processQueue = async () => {
    if(processing) return
    processing = true

    const target = stagingFiles.value.find(f => !f.done)
    if(!target) {
      processing = false
      return
    }

    target.progress = 10

    const buff = await target.file.arrayBuffer()
    target.progress = 12
    try {
      const headers: { [key: string]: string } = {
        'Content-Type': 'application/pdf',
      }
      if(unref(token)) {
        headers['Authorization'] = 'Bearer ' + unref(token)
      }
      const res = await fetch('/process/inline?preset=' + unref(preset), {
        method: 'POST',
        headers,
        body: buff
      })
      target.progress = 30
      if(!res.ok) throw new Error('Processing failed')
      const blob = await res.blob()
      target.url = URL.createObjectURL(blob)
      target.progress = 80
      downloadUrl(target.url, target.file.name.replace('.pdf', 'c.pdf'))
      target.progress = 90
      target.result = blob
    } catch(err) {
      target.error = true
    }

    target.progress = 100
    target.done = true
    processing = false
    processQueue()
  }

  const provided = {
    addFiles,
    removeFile,
    processQueue,
    items: stagingFiles
  }
  provide(injectionKey, provided)
  return provided
}

export const useQueue = (): QueueContext => inject(injectionKey)!