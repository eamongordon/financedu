"use client";

import { Button } from "../ui/button";
import { deleteUser } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteUserButton() {
    const router = useRouter();

    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want your account? This is irreversible.");
        if (!confirmed) return;
        await deleteUser();
        toast.success("Successfully deleted account.");
        router.push("/");
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()}>
            Delete Account
        </Button>
    );
}