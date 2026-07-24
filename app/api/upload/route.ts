import { mkdir, writeFile } from "fs/promises"
import {PDFParse} from 'pdf-parse'
import path from "path"
import {PrismaPg} from '@prisma/adapter-pg'
import { PrismaClient } from "@/app/generated/prisma/client"
import { GoogleGenAI,Type } from "@google/genai"
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
    const parser=new PDFParse({data:buffer})
    const {text}=await parser.getText()
    await parser.destroy()
    const adapter=new PrismaPg({connectionString: process.env.DATABASE_URL!})
    const prisma=new PrismaClient({adapter})

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

const geminiResponse = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: `Extract every transaction from this bank statement text. Text:\n\n${text}`,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    date: { type: Type.STRING, description: "YYYY-MM-DD" },
                    description: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    category: { type: Type.STRING, description: "e.g. Groceries, Dining, Transport, Bills, Entertainment, Other" },
                },
                required: ["date", "description", "amount", "category"],
            },
        },
    },
})

const transactions = JSON.parse(geminiResponse.text!)

for (const tx of transactions) {
    await prisma.expense.create({
        data: {
            amount: tx.amount,
            category: tx.category,
            description: tx.description,
            date: new Date(tx.date),
            authorId: 1,
        },
    })
}


    await prisma.$disconnect()

    return Response.json({ name: file.name, storedAs: safeName, size: file.size })
}
