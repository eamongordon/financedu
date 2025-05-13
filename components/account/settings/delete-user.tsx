"use client";

import { Button } from "../../ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteUserButton() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want your account? This is irreversible.");
        if (!confirmed) return;
        setLoading(true);
        const { error } = await authClient.deleteUser();
        setLoading(false);
        if (error) {
            console.error(error);
            toast("Failed to delete account. Please try again.");
            return;
        }
        router.push("/");
        router.refresh();
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()} disabled={loading}>
            Delete Account
        </Button>
    );
}