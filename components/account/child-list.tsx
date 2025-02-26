"use client";

import { getParentChildren, deleteParentChildRelationship, resendParentChildInvite } from "@/lib/actions";
import { Card } from "../ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { MoreVertical, User } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

    async function removeChild(childId: string, isPending: boolean) {
        await deleteParentChildRelationship(childId);
        toast.success(isPending ? 'Invite cancelled' : 'Child removed');
        router.refresh();
    }

    return (parentChildren.approved.length === 0 && parentChildren.pending.length === 0) ? (
        <div className="flex items-center justify-center mt-6">
            <p className="text-lg font-semibold mt-6">
                You haven&apos;t added any children yet.
            </p>
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
                                onClick={() => resendParentChildInvite(childParentObj.childId)}
                            >
                                Resend Invite
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => removeChild(childParentObj.childId, true)}
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
                    nameStr += childParentObj.child.lastName;
                }
                if (!hasFirstName && !hasLastName) {
                    nameStr = childParentObj.child.email!;
                }
                return (
                    <div key={childParentObj.childId} className="flex items-center justify-between py-4 p-6">
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
                                <DropdownMenuItem>View Progress</DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-red-600"
                                    onSelect={() => removeChild(childParentObj.childId, false)}
                                >
                                    Remove
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                );
            })}
        </Card>
    );
}