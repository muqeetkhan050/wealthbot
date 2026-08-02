import Header from "@/components/Header";
import Leftbar from "@/components/leftbar";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const session = await decrypt(cookieStore.get('session')?.value)

    const user = session
        ? await prisma.user.findUnique({ where: { id: session.userId } })
        : null

    return (
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <Header email={user?.email ?? ""} />
            <div className="flex flex-1">
                <Leftbar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}
