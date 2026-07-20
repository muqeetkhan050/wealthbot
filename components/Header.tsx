



export default function Header({email}: {email:string}){
    return(
        <header className="flex items-center justify-between bg-zinc-100 dark:bg-black py-4 px-6">
            <h1 className="text-2xl font-bold text-black dark:text-zinc-50">WealthBot</h1>
            <div className="text-sm text-zinc-700 dark:text-zinc-300">{email}</div>
        </header>
    )
}