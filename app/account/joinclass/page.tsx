import { auth } from "@/lib/auth";
import { ClassJoinConfirm } from "@/components/account/class-join-confirm";
import { ClassCodeForm } from "@/components/account/class-code-form";
import { getClassFromClassCode } from "@/lib/actions";

export default async function Page({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const joinCode = (await searchParams)?.code as string | undefined;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    if (!isLoggedIn) {
        throw new Error("Not authenticated");
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