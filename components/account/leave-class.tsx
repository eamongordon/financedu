"use client";

import { useParams } from "next/navigation";
import { Button } from "../ui/button";
import { leaveClass } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

export function LeaveClassButton({ isTeacher, disabled, isGhost }: { isTeacher?: boolean, disabled?: boolean, isGhost?: boolean }) {
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

    return disabled ? (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <span>
                        <Button
                            variant={isTeacher ? isGhost ? "ghost" : "outline" : "destructive"}
                            {...(isTeacher && isGhost ? { className: "text-destructive" } : { className: "border-destructive text-destructive hover:text-destructive" })}
                            disabled
                        >
                            Leave Class
                        </Button>
                    </span>
                </TooltipTrigger>
                <TooltipContent>
                    <p>You cannot leave a class if you are the only teacher.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    ) : (
        <Button
            variant={isGhost ? "ghost" : isTeacher ? "outline" : "destructive"}
            className={cn(isTeacher && "text-destructive hover:text-destructive", !isGhost && "border-destructive")}
            onClick={() => handleSubmit()}
        >
            Leave Class
        </Button>
    );
}