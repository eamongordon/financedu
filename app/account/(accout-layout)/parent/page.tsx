import { getParentChildren } from "@/lib/actions";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { InviteChild } from "@/components/account/invite-child";

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
};

export default async function Parent() {
    const children = await getParentChildren();
    return (
        <section>
            <div className="flex items-center justify-between space-y-0.5 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Children</h2>
                    <p className="text-muted-foreground">
                        Track your children&apos;s progress and manage their accounts.
                    </p>
                </div>
                <InviteChild />
            </div>
            {(children.approved.length === 0 && children.pending.length === 0) ? (
                <div className="flex items-center justify-center mt-6">
                    <p className="text-lg font-semibold mt-6">
                        You haven&apos;t added any children yet.
                    </p>
                </div>
            ) : (
                <Card className="mt-6 divide-y shadow-none">
                    {children.pending.map((childParentObj) => {
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
                                    <Button variant="outline">
                                        Resend Invite
                                    </Button>
                                    <Button variant="destructive">
                                        Cancel Invite
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                    {children.approved.map((childParentObj) => {
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
                                        <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        );
                    })}
                </Card>
            )}
        </section>
    );
}