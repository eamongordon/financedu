import { auth } from "@/lib/auth";
import { getParentChildInvite } from "@/lib/actions";
import { ParentInvite } from "@/components/parentinvite";

export default async function Page({
    params,
}: {
    params: Promise<{ parentId: string }>
}) {
    const parentId = (await params).parentId;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    if (!isLoggedIn) {
        throw new Error("Not authenticated");
    }
    const invite = await getParentChildInvite(parentId);
    if (!invite) {
        throw new Error("Invite not found");
    }
    
    return (
        <ParentInvite invite={invite} />
    );
}