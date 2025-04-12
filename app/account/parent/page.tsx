import type { Metadata } from 'next';
import { getParentChildren } from "@/lib/fetchers";
import { InviteChild } from "@/components/account/invite-child";
import { ChildList } from "@/components/account/child-list";

export const metadata: Metadata = {
    title: 'My Children'
}

export default async function Parent() {
    const children = await getParentChildren();
    return (
        <section>
            <div className="flex items-center justify-between gap-2 space-y-0.5 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Children</h2>
                    <p className="text-muted-foreground">
                        Track your children&apos;s progress and manage their accounts.
                    </p>
                </div>
                <InviteChild />
            </div>
            <ChildList parentChildren={children} />
        </section>
    );
}