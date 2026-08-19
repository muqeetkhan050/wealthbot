import { cookies } from "next/headers"
import { GoogleGenAI } from "@google/genai"
import { prisma } from "@/lib/prisma"
import { decrypt } from "@/lib/session"

const MAX_TRANSACTIONS = 500

function isRetryableGeminiError(error: unknown) {
    const status = (error as { status?: number })?.status
    return status === 503 || status === 429
}

export async function POST(request: Request) {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    if (!session) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { question } = await request.json()

    if (!question || typeof question !== "string") {
        return Response.json({ error: "Question is required" }, { status: 400 })
    }

    const [expenses, incomes] = await Promise.all([
        prisma.expense.findMany({
            where: { authorId: session.userId },
            orderBy: { date: "desc" },
            take: MAX_TRANSACTIONS,
        }),
        prisma.income.findMany({
            where: { authorId: session.userId },
            orderBy: { date: "desc" },
            take: MAX_TRANSACTIONS,
        }),
    ])

    if (expenses.length === 0 && incomes.length === 0) {
        return Response.json({
            answer: "You don't have any income or expenses recorded yet, so I don't have anything to answer from.",
        })
    }

    const rows = [
        ...expenses.map((e) => `${e.date.toISOString().split("T")[0]},EXPENSE,${e.category},${e.description ?? ""},${e.amount}`),
        ...incomes.map((i) => `${i.date.toISOString().split("T")[0]},INCOME,${i.category},${i.description ?? ""},${i.amount}`),
    ].join("\n")

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

    const prompt = `You are a personal finance assistant. Answer the user's question using ONLY the transaction data below. Each line is: date,type,category,description,amount.

Transactions:
date,type,category,description,amount
${rows}

Question: ${question}

Answer concisely in plain language (1-2 sentences). Give ONE single, direct answer using all the data as a whole — do not break the answer down by month or period unless the question explicitly asks for a breakdown (e.g. "per month", "each month", "by category"). If the data doesn't contain enough information to answer, say so instead of guessing.`

    try {
        const response = await ai.models.generateContent({
            model: "gemini-flash-latest",
            contents: prompt,
        })

        return Response.json({ answer: response.text })
    } catch (error) {
        if (isRetryableGeminiError(error)) {
            return Response.json(
                { error: "The AI model is temporarily overloaded. Please try again in a minute." },
                { status: 503 }
            )
        }
        throw error
    }
}
