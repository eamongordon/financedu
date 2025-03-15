import type { Metadata } from 'next';
import { auth } from "@/lib/auth";
import { ClassJoinConfirm } from "@/components/account/class-join-confirm";
import { ClassCodeForm } from "@/components/account/class-code-form";
import { getClassFromClassCode } from "@/lib/actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: 'Join Class',
    description: 'Join your class and complete assignments on Financedu, a free online financial education platform.'
}

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const joinCode = (await searchParams)?.code as string | undefined;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    
    if (!isLoggedIn) {
       return redirect(`/login?redirect=${encodeURIComponent(`/join?code=${joinCode}`)}`);
    }

    const classItem = joinCode ? await getClassFromClassCode(joinCode) : undefined;

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