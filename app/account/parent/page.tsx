import { getParentChildren } from "@/lib/actions";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, User, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

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
                <Button className="mt-6">
                    <Plus />
                    Add Child
                </Button>
            </div>
            {children.length === 0 ? (
                <div className="flex items-center justify-center mt-6">
                    <p className="text-lg font-semibold mt-6">
                        You haven&apos;t added any children yet.
                    </p>
                </div>
            ) : (
                <Card className="mt-6 divide-y shadow-none">
                    {children.map((child) => {
                        const hasFirstName = !!child.child.firstName;
                        const hasLastName = !!child.child.lastName;
                        let nameStr = '';
                        if (hasFirstName) {
                            nameStr += child.child.firstName;
                        }
                        if (hasLastName) {
                            nameStr += child.child.lastName;
                        }
                        if (!hasFirstName && !hasLastName) {
                            nameStr = child.child.email!;
                        }
                        return (
                            <div key={child.childId} className="flex items-center justify-between py-4 p-6">
                                <div className="flex flex-row items-center gap-4">
                                    <Avatar className="size-12">
                                        {child.child.image ? (
                                            <AvatarImage src={child.child.image} alt={nameStr} />
                                        ) : null}
                                        <AvatarFallback>
                                            {getInitials(nameStr) || <User className="h-4 w-4" />}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex flex-col justify-start text-start gap-2">
                                        <p className="leading-none font-semibold">
                                            {nameStr}
                                        </p>
                                        {(!hasFirstName && !hasLastName) && (
                                            <p className="text-sm text-muted-foreground leading-none">{child.child.email}</p>
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