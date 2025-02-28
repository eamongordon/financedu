import { TabsNav } from "@/components/account/tabs-nav";
import { getParentChildApproved } from "@/lib/actions";
import { auth } from "@/lib/auth";

function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export default async function LessonLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ childId: string }>
}) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const childId = (await params).childId;

    const navItems = [
        {
            name: "Progress",
            href: `/account/parent/${childId}`,
        }, 
        {
            name: "Completion",
            href: `/account/parent/${childId}/completion`,
        }
    ];

    const childParentObj = await getParentChildApproved(childId);
    let nameStr = '';
    const hasFirstName = !!childParentObj.child.firstName;
    const hasLastName = !!childParentObj.child.lastName;
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
        <main>
            <div className="space-y-0.5 border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight">Progress for {nameStr}</h2>
                <p className="text-muted-foreground">
                    Added on {formatDate(childParentObj.acceptedAt!)}
                </p>
            </div>
            <TabsNav navItems={navItems} />
            {children}
        </main>
    );
}