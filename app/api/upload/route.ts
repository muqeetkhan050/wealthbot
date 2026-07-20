import { mkdir, writeFile } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "uploads")
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
        return Response.json({ error: "No file provided" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
        return Response.json({ error: "File exceeds 10MB limit" }, { status: 413 })
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(UPLOAD_DIR, safeName), buffer)

    return Response.json({ name: file.name, storedAs: safeName, size: file.size })
}
