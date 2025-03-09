"use client";

import { Button } from "../ui/button";
import { deleteUser } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteUserButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want your account? This is irreversible.");
        if (!confirmed) return;
        setLoading(true);
        await deleteUser();
        setLoading(false);
        toast.success("Successfully deleted account.");
        router.push("/");
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()} disabled={loading}>
            Delete Account
        </Button>
    );
}