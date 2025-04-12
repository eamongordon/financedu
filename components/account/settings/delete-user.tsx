"use client";

import { Button } from "../../ui/button";
import { deleteUser } from "@/lib/actions";
import { useState } from "react";
import { signOut } from "next-auth/react";

export function DeleteUserButton() {
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want your account? This is irreversible.");
        if (!confirmed) return;
        setLoading(true);
        await deleteUser();
        setLoading(false);
        signOut({ callbackUrl: "/" });
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()} disabled={loading}>
            Delete Account
        </Button>
    );
}