import type { Metadata } from "next";
import { TabsNav } from "@/components/account/tabs-nav";
import { getParentChildApproved } from "@/lib/fetchers";
import { auth } from "@/lib/auth";
import { getDisplayName } from "@/lib/utils";

function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        month: "long",
        day: "numeric",
        year: "numeric"
    };
    return new Intl.DateTimeFormat('en-US', options).format(date);
}

export async function generateMetadata(
    { params }: { params: Promise<{ childId: string }> }
): Promise<Metadata> {
    const { childId } = await params;
    const childParentObj = await getParentChildApproved(childId);
    const nameStr = getDisplayName(childParentObj.child.firstName, childParentObj.child.lastName, childParentObj.child.email!);
    return {
        title: nameStr
    }
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
    const nameStr = getDisplayName(childParentObj.child.firstName, childParentObj.child.lastName, childParentObj.child.email!);

    return (
        <main>
            <div className="space-y-0.5 border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight">Progress for {nameStr}</h2>
                <p className="text-muted-foreground">
                    Added on {formatDate(childParentObj.createdAt!)}
                </p>
            </div>
            <TabsNav navItems={navItems} />
            {children}
        </main>
    );
}