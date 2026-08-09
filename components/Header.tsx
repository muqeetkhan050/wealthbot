import Logo from "@/components/Logo";

export default function Header({ email, profilePicture }: { email: string; profilePicture: string | null }) {
    return (
        <header className="flex items-center justify-between rounded-2xl py-4 px-6" style={{ backgroundColor: "#CCD1B0" }}>
            <Logo />
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
