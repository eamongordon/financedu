"use client";

import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { deleteClass } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function DeleteClassButton() {
    const params = useParams<{ classId: string }>();
    const classId = params!.classId;
    const router = useRouter();
    
    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want to delete this class?");
        if (!confirmed) return;
        await deleteClass(classId);
        toast.success("Successfully deleted class.");
        router.push("/account/teacher");
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()}>
            Delete Class
        </Button>
    );
}