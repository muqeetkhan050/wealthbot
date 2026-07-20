'use client'
import { useRef, useState } from "react"

type UploadStatus = "uploading" | "done" | "error"

type UploadItem = {
    name: string
    status: UploadStatus
    error?: string
}

export default function UploadDocument() {
    const [items, setItems] = useState<UploadItem[]>([])
    const [dragActive, setDragActive] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    async function uploadFile(file: File) {
        setItems((prev) => [...prev, { name: file.name, status: "uploading" }])

        const formData = new FormData()
        formData.append("file", file)

        try {
            const res = await fetch("/api/upload", { method: "POST", body: formData })
            if (!res.ok) {
                const body = await res.json().catch(() => null)
                throw new Error(body?.error ?? "Upload failed")
            }
            setItems((prev) =>
                prev.map((item) =>
                    item.name === file.name && item.status === "uploading"
                        ? { ...item, status: "done" }
                        : item
                )
            )
        } catch (err) {
            setItems((prev) =>
                prev.map((item) =>
                    item.name === file.name && item.status === "uploading"
                        ? { ...item, status: "error", error: (err as Error).message }
                        : item
                )
            )
        }
    }

    function handleFiles(fileList: FileList | null) {
        if (!fileList) return
        Array.from(fileList).forEach(uploadFile)
    }

    return (
        <div>
            <div
                onDragOver={(e) => {
                    e.preventDefault()
                    setDragActive(true)
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                    e.preventDefault()
                    setDragActive(false)
                    handleFiles(e.dataTransfer.files)
                }}
                onClick={() => inputRef.current?.click()}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                    dragActive
                        ? "border-zinc-500 bg-zinc-100 dark:bg-zinc-900"
                        : "border-zinc-300 dark:border-zinc-700"
                }`}
            >
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Drag and drop a document here, or click to browse
                </p>
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                />
            </div>

            {items.length > 0 && (
                <ul className="mt-4 space-y-2">
                    {items.map((item, i) => (
                        <li
                            key={`${item.name}-${i}`}
                            className="flex items-center justify-between rounded-md bg-zinc-100 px-3 py-2 text-sm dark:bg-zinc-900"
                        >
                            <span className="text-black dark:text-zinc-50">{item.name}</span>
                            {item.status === "uploading" && (
                                <span className="text-zinc-500">Uploading…</span>
                            )}
                            {item.status === "done" && (
                                <span className="text-green-600 dark:text-green-400">Done</span>
                            )}
                            {item.status === "error" && (
                                <span className="text-red-600 dark:text-red-400">{item.error}</span>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
