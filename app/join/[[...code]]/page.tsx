import type { Metadata } from 'next';
import { auth } from "@/lib/auth";
import { ClassJoinConfirm } from "@/components/account/classes/class-join-confirm";
import { ClassCodeForm } from "@/components/account/classes/class-code-form";
import { getClassFromClassCode } from "@/lib/fetchers";
import { notFound, redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Join Class',
}

export default async function Page({
    params,
}: {
    params: Promise<{ code: string[] | undefined }>
}) {
    const joinCode = (await params).code;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    
    if (!isLoggedIn) {
       return redirect(`/login?redirect=${encodeURIComponent(`/join/${joinCode}`)}`);
    }
    
    if (joinCode && joinCode.length > 1) {
        return notFound();
    }

    const classItem = joinCode && joinCode.length > 0 ? await getClassFromClassCode(joinCode[0]) : undefined;

    return (
        <main className="min-h-[calc(50dvh)] flex flex-col justify-center items-center gap-4">
            {joinCode && classItem ? (
                <>
                    <ClassJoinConfirm classItem={classItem!} />
                </>
            ) : (
                <>
                    <h2 className="text-3xl font-semibold">Join Class</h2>
                    <ClassCodeForm isInvalidCode={!!joinCode} rerenderKey={(new Date()).toISOString()}/>
                </>
            )}
        </main>
    );
}