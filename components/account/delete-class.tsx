"use client";

import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { deleteClass } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteClassButton() {
    const params = useParams<{ classId: string }>();
    const classId = params!.classId;
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want to delete this class?");
        if (!confirmed) return;
        setLoading(true);
        await deleteClass(classId);
        setLoading(false);
        toast.success("Successfully deleted class.");
        router.push("/account/teacher");
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()} disabled={loading}>
            Delete Class
        </Button>
    );
}