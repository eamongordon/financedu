"use client";

import { Button } from "../../ui/button";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export function DeleteUserButton() {
    const [loading, setLoading] = useState(false);


    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want your account? This is irreversible.");
        if (!confirmed) return;
        setLoading(true);
        await authClient.deleteUser({
            callbackURL: "/"
        });
        setLoading(false);
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()} disabled={loading}>
            Delete Account
        </Button>
    );
}