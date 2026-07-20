import Header from "@/components/Header";
import Leftbar from "@/components/leftbar";

export default function DashboardLayout({children}:{children:React.ReactNode}){
    return(
        <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black">
            <Header email="thisismuqeet@gmail.com" />
            <div className="flex flex-1">
                <Leftbar />
                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    )
}