export default function Header({ email, profilePicture }: { email: string; profilePicture: string | null }) {
    return (
        <header className="flex items-center justify-between bg-zinc-100 dark:bg-black py-4 px-6">
            <h1 className="text-2xl font-bold text-black dark:text-zinc-50">WealthBot</h1>
            <div className="flex items-center gap-3">
                <div className="text-sm text-zinc-700 dark:text-zinc-300">{email}</div>
                {profilePicture ? (
                    <img src={profilePicture} alt="Profile picture" className="size-8 rounded-full object-cover" />
                ) : (
                    <div className="size-8 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                )}
            </div>
        </header>
    )
}
