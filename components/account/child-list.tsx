"use client";

import { getParentChildren, deleteParentChildRelationship, resendParentChildInvite } from "@/lib/actions";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreVertical, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { InviteChild } from "./invite-child";
import Link from "next/link";

type ParentChildren = Awaited<ReturnType<typeof getParentChildren>>;

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
};

export function ChildList({ parentChildren }: { parentChildren: ParentChildren }) {
    const router = useRouter();
    const [loadingState, setLoadingState] = useState<{ [key: string]: { resend: boolean; cancel: boolean; remove: boolean } }>({});

    async function removeChild(childId: string, isPending: boolean) {
        setLoadingState((prev) => ({ ...prev, [childId]: { ...prev[childId], cancel: true } }));
        await deleteParentChildRelationship(childId);
        toast.success(isPending ? 'Invite cancelled' : 'Child removed');
        setLoadingState((prev) => ({ ...prev, [childId]: { ...prev[childId], cancel: false } }));
        router.refresh();
    }

    async function handleResendInvite(childId: string) {
        setLoadingState((prev) => ({ ...prev, [childId]: { ...prev[childId], resend: true } }));
        await resendParentChildInvite(childId);
        toast.success('Invite resent');
        setLoadingState((prev) => ({ ...prev, [childId]: { ...prev[childId], resend: false } }));
    }

    async function handleRemove(childId: string) {
        const confirmed = window.confirm("Are you sure you want to remove this child?");
        if (!confirmed) return;
        setLoadingState((prev) => ({ ...prev, [childId]: { ...prev[childId], remove: true } }));
        await deleteParentChildRelationship(childId);
        toast.success('Child removed');
        setLoadingState((prev) => ({ ...prev, [childId]: { ...prev[childId], remove: false } }));
        router.refresh();
    }

    return (parentChildren.approved.length === 0 && parentChildren.pending.length === 0) ? (
        <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-lg font-semibold mt-6">
                You haven&apos;t added any children yet.
            </p>
            <InviteChild isNoChildren />
        </div>
    ) : (
        <Card className="mt-6 divide-y shadow-none">
            {parentChildren.pending.map((childParentObj) => {
                return (
                    <div key={childParentObj.childId} className="flex items-center justify-between py-4 p-6">
                        <div className="flex flex-row items-center gap-4">
                            <Avatar className="size-12">
                                <AvatarFallback>
                                    {getInitials(childParentObj.child.email!) || <User className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-start text-start gap-2">
                                <p className="leading-none font-semibold">
                                    {childParentObj.child.email}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => handleResendInvite(childParentObj.childId)}
                                disabled={loadingState[childParentObj.childId]?.resend}
                                isLoading={loadingState[childParentObj.childId]?.resend}
                            >
                                Resend Invite
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => removeChild(childParentObj.childId, true)}
                                disabled={loadingState[childParentObj.childId]?.cancel}
                                isLoading={loadingState[childParentObj.childId]?.cancel}
                            >
                                Cancel Invite
                            </Button>
                        </div>
                    </div>
                );
            })}
            {parentChildren.approved.map((childParentObj) => {
                const hasFirstName = !!childParentObj.child.firstName;
                const hasLastName = !!childParentObj.child.lastName;
                let nameStr = '';
                if (hasFirstName) {
                    nameStr += childParentObj.child.firstName;
                }
                if (hasLastName) {
                    nameStr += " " + childParentObj.child.lastName;
                }
                if (!hasFirstName && !hasLastName) {
                    nameStr = childParentObj.child.email!;
                }
                return (
                    <Link key={childParentObj.childId} href={`/account/parent/${childParentObj.childId}`} className="flex items-center justify-between py-4 p-6">
                        <div className="flex flex-row items-center gap-4">
                            <Avatar className="size-12">
                                {childParentObj.child.image ? (
                                    <AvatarImage src={childParentObj.child.image} alt={nameStr} />
                                ) : null}
                                <AvatarFallback>
                                    {getInitials(nameStr) || <User className="h-4 w-4" />}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-start text-start gap-2">
                                <p className="leading-none font-semibold">
                                    {nameStr || childParentObj.child.email}
                                </p>
                                {nameStr && (
                                    <p className="text-sm text-muted-foreground leading-none">{childParentObj.child.email}</p>
                                )}
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="[&_svg]:size-auto p-0">
                                    <MoreVertical />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem asChild>
                                    <Link href={`/account/parent/${childParentObj.childId}`}>
                                        View Progress
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={() => handleRemove(childParentObj.childId)}
                                    disabled={loadingState[childParentObj.childId]?.remove}
                                >
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </Link>
                );
            })}
        </Card>
    );
}