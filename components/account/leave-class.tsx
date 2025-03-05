"use client";

import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { leaveClass } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function LeaveClassButton({ isTeacher }: { isTeacher: boolean }) {
    const params = useParams<{ classId: string }>();
    const classId = params!.classId;
    const router = useRouter();
    async function handleSubmit() {
        const confirmed = window.confirm("Are you sure you want to leave this class?");
        if (!confirmed) return;
        await leaveClass(classId);
        toast.success("Successfully left the class!");
        if (isTeacher) {
            router.push("/account/teacher");
        } else {
            router.push("/account/student");
        }
    }

    return (
        <Button variant="destructive" onClick={() => handleSubmit()}>
            Leave Class
        </Button>
    );
}