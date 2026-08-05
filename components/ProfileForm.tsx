'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type ProfileFormProps = {
    email: string
    dateOfBirth: string | null
    monthlyIncome: number | null
    profilePicture: string | null
}

export function ProfileForm({ email, dateOfBirth, monthlyIncome, profilePicture }: ProfileFormProps) {
    const [preview, setPreview] = useState(profilePicture)
    const [profileStatus, setProfileStatus] = useState<string | null>(null)
    const [profileError, setProfileError] = useState<string | null>(null)

    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [passwordStatus, setPasswordStatus] = useState<string | null>(null)
    const [passwordError, setPasswordError] = useState<string | null>(null)

    async function handleProfileSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setProfileStatus(null)
        setProfileError(null)

        const formData = new FormData(e.currentTarget)
        const res = await fetch("/api/profile", { method: "PATCH", body: formData })

        if (!res.ok) {
            const body = await res.json().catch(() => null)
            setProfileError(body?.error ?? "Failed to update profile")
            return
        }

        const updated = await res.json()
        if (updated.profilePicture) setPreview(updated.profilePicture)
        setProfileStatus("Profile updated")
    }

    function handlePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) setPreview(URL.createObjectURL(file))
    }

    async function handlePasswordSubmit(e: React.FormEvent) {
        e.preventDefault()
        setPasswordStatus(null)
        setPasswordError(null)

        const res = await fetch("/api/profile/password", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ currentPassword, newPassword }),
        })

        if (!res.ok) {
            const body = await res.json().catch(() => null)
            setPasswordError(body?.error ?? "Failed to change password")
            return
        }

        setCurrentPassword("")
        setNewPassword("")
        setPasswordStatus("Password changed")
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profile details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleProfileSubmit} className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                            {preview ? (
                                <img src={preview} alt="Profile picture" className="size-16 rounded-full object-cover" />
                            ) : (
                                <div className="size-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                            )}
                            <div className="grid gap-2">
                                <Label htmlFor="profilePicture">Profile picture</Label>
                                <Input id="profilePicture" name="profilePicture" type="file" accept="image/*" onChange={handlePictureChange} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Email</Label>
                            <Input value={email} disabled />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dateOfBirth">Date of birth</Label>
                            <Input id="dateOfBirth" name="dateOfBirth" type="date" defaultValue={dateOfBirth ?? ""} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="monthlyIncome">Monthly income</Label>
                            <Input id="monthlyIncome" name="monthlyIncome" type="number" step="0.01" defaultValue={monthlyIncome ?? ""} />
                        </div>

                        <Button type="submit">Save changes</Button>
                        {profileStatus && <p className="text-sm text-green-600 dark:text-green-400">{profileStatus}</p>}
                        {profileError && <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>}
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Change password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="currentPassword">Current password</Label>
                            <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="newPassword">New password</Label>
                            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                        </div>
                        <Button type="submit">Change password</Button>
                        {passwordStatus && <p className="text-sm text-green-600 dark:text-green-400">{passwordStatus}</p>}
                        {passwordError && <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>}
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
