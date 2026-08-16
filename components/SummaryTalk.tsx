'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

type Message = {
    question: string
    answer?: string
    error?: string
}

export function SummaryTalk() {
    const [question, setQuestion] = useState("")
    const [messages, setMessages] = useState<Message[]>([])
    const [asking, setAsking] = useState(false)

    async function handleAsk(e: React.FormEvent) {
        e.preventDefault()
        const trimmed = question.trim()
        if (!trimmed || asking) return

        setQuestion("")
        setAsking(true)
        setMessages((prev) => [...prev, { question: trimmed }])

        const res = await fetch("/api/summary-talk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: trimmed }),
        })

        const body = await res.json().catch(() => null)

        setMessages((prev) =>
            prev.map((m, i) =>
                i === prev.length - 1
                    ? res.ok
                        ? { ...m, answer: body?.answer ?? "No answer returned." }
                        : { ...m, error: body?.error ?? "Something went wrong." }
                    : m
            )
        )
        setAsking(false)
    }

    return (
        <div className="flex h-[75vh] w-full flex-col gap-4">
            <Card className="flex-1 overflow-hidden">
                <CardContent className="flex h-full flex-col gap-4 overflow-y-auto">
                    {messages.length === 0 ? (
                        <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Ask anything about your income and expenses — e.g. &quot;which
                            restaurant did I spend the most at?&quot; or &quot;how much did I
                            spend on coffee last month?&quot;
                        </p>
                    ) : (
                        messages.map((m, i) => (
                            <div key={i} className="flex flex-col gap-2">
                                <p className="self-end rounded-2xl bg-zinc-900 px-4 py-2 text-sm text-zinc-50 dark:bg-zinc-50 dark:text-zinc-900">
                                    {m.question}
                                </p>
                                {m.answer && (
                                    <p className="self-start rounded-2xl bg-black/5 px-4 py-2 text-sm text-zinc-900 dark:bg-white/10 dark:text-zinc-100">
                                        {m.answer}
                                    </p>
                                )}
                                {m.error && (
                                    <p className="self-start rounded-2xl bg-destructive/10 px-4 py-2 text-sm text-destructive">
                                        {m.error}
                                    </p>
                                )}
                                {!m.answer && !m.error && i === messages.length - 1 && (
                                    <p className="self-start px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400">
                                        Thinking…
                                    </p>
                                )}
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>

            <form onSubmit={handleAsk} className="flex shrink-0 gap-2">
                <Input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask a question about your finances"
                    className="flex-1 border border-black/40 dark:border-white/40"
                    disabled={asking}
                />
                <Button type="submit" disabled={asking || !question.trim()} className="ml-auto shrink-0">
                    {asking ? "Asking…" : "Ask"}
                </Button>
            </form>
        </div>
    )
}
