import type { Metadata } from "next";
import { getSession } from "@/lib/auth";
import { getClassTeacherInvite } from "@/lib/fetchers";
import { TeacherInvite } from "@/components/teacherinvite";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Join Class'
}

export default async function Page({
    params,
}: {
    params: Promise<{ inviteId: string }>
}) {
    const inviteId = (await params).inviteId;
    const session = await getSession();
    const isLoggedIn = session && session.user && session.user.id;
    if (!isLoggedIn) {
        return redirect(`/login?redirect=${encodeURIComponent(`/parentinvite/${inviteId}`)}`);
    }
    const invite = await getClassTeacherInvite(inviteId);
    if (!invite) {
        throw new Error("Invite not found");
    }

    return (
        <TeacherInvite invite={invite} />
    );
}