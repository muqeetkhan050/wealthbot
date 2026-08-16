import { ClearDataButton } from "@/components/ClearDataButton"

export default function SettingsPage() {
    return (
        <div className="max-w-lg space-y-8">
            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">Settings</h2>
            <ClearDataButton />
        </div>
    )
}
