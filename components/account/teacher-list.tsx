"use client";

import { deleteClassTeacherInvite, getClassTeacherWithRoster, resendClassTeacherInvite } from "@/lib/actions";
import { Card } from "../ui/card";
import { User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { getDisplayName, getInitials } from "@/lib/utils";
import { LeaveClassButton } from "./leave-class";

type ClassItem = Awaited<ReturnType<typeof getClassTeacherWithRoster>>;

export function TeacherList({ classItem, userId }: { classItem: ClassItem, userId: string }) {
    const router = useRouter();
    const [loadingState, setLoadingState] = useState<{ [key: string]: { resend: boolean; cancel: boolean; remove: boolean } }>({});

    async function cancelInvite(inviteId: string) {
        setLoadingState((prev) => ({ ...prev, [inviteId]: { ...prev[inviteId], cancel: true } }));
        await deleteClassTeacherInvite(inviteId);
        toast.success('Invite cancelled');
        setLoadingState((prev) => ({ ...prev, [inviteId]: { ...prev[inviteId], cancel: false } }));
        router.refresh();
    }

    async function handleResendInvite(inviteId: string) {
        setLoadingState((prev) => ({ ...prev, [inviteId]: { ...prev[inviteId], resend: true } }));
        await resendClassTeacherInvite(inviteId);
        toast.success('Invite resent');
        setLoadingState((prev) => ({ ...prev, [inviteId]: { ...prev[inviteId], resend: false } }));
    }

    return (
        <Card className="mt-6 divide-y shadow-none">
            {classItem.classTeacherInvites.map((classTeacherInvite) => {
                return (
                    <div key={classTeacherInvite.id} className="flex items-center justify-between py-4 p-6">
                        <div className="flex flex-row items-center gap-4">
                            <Avatar className="size-12">
                                <AvatarFallback>
                                    {getInitials(classTeacherInvite.teacherEmail!) || <User className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-start text-start gap-2">
                                <p className="leading-none font-semibold">
                                    {classTeacherInvite.teacherEmail}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleResendInvite(classTeacherInvite.id)}
                                disabled={loadingState[classTeacherInvite.id]?.resend}
                                isLoading={loadingState[classTeacherInvite.id]?.resend}
                            >
                                Resend Invite
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => cancelInvite(classTeacherInvite.id)}
                                disabled={loadingState[classTeacherInvite.id]?.cancel}
                                isLoading={loadingState[classTeacherInvite.id]?.cancel}
                            >
                                Cancel Invite
                            </Button>
                        </div>
                    </div>
                );
            })}
            {classItem.classTeachers.map((classTeacherObj) => {
                const nameStr = getDisplayName(classTeacherObj.teacher.firstName, classTeacherObj.teacher.lastName, classTeacherObj.teacher.email!);
                return (
                    <div key={classTeacherObj.teacherId} className="flex items-center justify-between py-4 p-6">
                        <div className="flex flex-row items-center gap-4">
                            <Avatar className="size-12">
                                {classTeacherObj.teacher.image ? (
                                    <AvatarImage src={classTeacherObj.teacher.image} alt={nameStr} />
                                ) : null}
                                <AvatarFallback>
                                    {getInitials(nameStr) || <User className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-start text-start gap-2">
                                <p className="leading-none font-semibold">
                                    {nameStr || classTeacherObj.teacher.email}
                                </p>
                                {nameStr && (
                                    <p className="text-sm text-muted-foreground leading-none">{classTeacherObj.teacher.email}</p>
                                )}
                            </div>
                        </div>
                        {classTeacherObj.teacherId === userId && (
                            <LeaveClassButton
                                isGhost
                                isTeacher
                                disabled={classItem.classTeachers.length === 1}
                            />
                        )}
                    </div>
                );
            })}
        </Card>
    );
}