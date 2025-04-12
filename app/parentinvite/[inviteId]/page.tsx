import type { Metadata } from 'next';
import { auth } from "@/lib/auth";
import { getParentChildInvite } from "@/lib/fetchers";
import { ParentInvite } from "@/components/parentinvite";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Parent Access Request'
}

export default async function Page({
    params,
}: {
    params: Promise<{ inviteId: string }>
}) {
    const inviteId = (await params).inviteId;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    if (!isLoggedIn) {
        return redirect(`/login?redirect=${encodeURIComponent(`/parentinvite/${inviteId}`)}`);
    }
    const invite = await getParentChildInvite(inviteId);
    if (!invite) {
        throw new Error("Invite not found");
    }
    
    return (
        <ParentInvite invite={invite} />
    );
}