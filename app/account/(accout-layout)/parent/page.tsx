import { getParentChildren } from "@/lib/actions";
import { InviteChild } from "@/components/account/invite-child";
import { ChildList } from "@/components/account/child-list";

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
            <ChildList parentChildren={children} />
        </section>
    );
}