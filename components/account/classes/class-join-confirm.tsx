"use client";

import { Button } from "../../ui/button"
import { getClassFromClassCode } from "@/lib/fetchers"
import { joinClass } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

type ClassItem = Awaited<ReturnType<typeof getClassFromClassCode>>;

export function ClassJoinConfirm({ classItem }: { classItem: ClassItem }) {
    const router = useRouter();
    
    const [isLoading, setLoading] = useState(false);
    async function handleJoin() {
        try {
        setLoading(true);
        const joinedClass = await joinClass(classItem!.joinCode);
            toast.success("You have successfully joined the class!");
            router.push(`/account/student/${joinedClass.class.id}`);
            setLoading(false);
        } catch {
            toast.error("An error occurred. You may already be in this class.");
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 px-4 w-full sm:w-1/3">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-semibold">You are joining:</h1>
                <h3 className="text-2xl text-muted-foreground font-semibold">{classItem!.name}</h3>
            </div>
            <div className="flex flex-col gap-2 w-full">
                <Button className="w-full text-base" isLoading={isLoading} onClick={handleJoin}>
                    Join {classItem!.name}
                </Button>
                <Button variant="outline" className="w-full text-base" onClick={() => router.push("/join")}>
                    I&apos;m in a different class
                </Button>
            </div>
        </div>
    )
}