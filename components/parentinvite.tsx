"use client";

import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import { type getParentChildInvite, acceptParentChildInvite, rejectParentChildInvite } from "@/lib/actions";
import Link from "next/link";

type ParentChildInvite = Awaited<ReturnType<typeof getParentChildInvite>>;
type Status = "pending" | "accepted" | "rejected";

export function ParentInvite({ invite }: { invite: ParentChildInvite }) {
    const { firstName, lastName, email } = invite.parent;
    const nameStr = [firstName, lastName].filter(Boolean).join(' ') || email!;
    const [status, setStatus] = useState<Status>("pending");
    const [isAllowedLoading, setIsAllowedLoading] = useState(false);
    const [isRejectedLoading, setIsRejectedLoading] = useState(false);

    async function handleAccept() {
        setIsAllowedLoading(true);
        await acceptParentChildInvite(invite.id);
        setStatus('accepted');
    }

    async function handleReject() {
        setIsRejectedLoading(true);
        await rejectParentChildInvite(invite.id);
        setStatus('rejected');
    }

    return (
        <main className="flex flex-col justify-center items-center gap-8 py-8 min-h-[calc(100dvh-64px)]">
            {status === 'pending' && (
                <>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold">{nameStr} is requesting parent access to your account.</h1>
                    </div>
                    <div className="text-center">
                        <h2>They will be able to see your name, email, and progress on courses.</h2>
                        <p className="font-semibold">Would you like to accept this request?</p>
                    </div>
                    <div className="flex space-x-4">
                        <Button variant="outline" className="w-24" isLoading={isRejectedLoading} onClick={() => handleReject()}>
                            Decline
                        </Button>
                        <Button className="w-24" isLoading={isAllowedLoading} onClick={handleAccept}>
                            Allow
                        </Button>
                    </div>
                </>
            )}
            {status === 'accepted' && (
                <>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold">You&apos;re all set!</h1>
                    </div>
                    <div className="text-center">
                        <h2>{nameStr} now has parent access to your account.</h2>
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/account/parent" className={buttonVariants()}>
                            Back to Dashboard
                        </Link>
                    </div>
                </>
            )}
            {status === 'rejected' && (
                <>
                    <div className="text-center">
                        <h1 className="text-xl font-semibold">Request Rejected.</h1>
                    </div>
                    <div className="text-center">
                        <h2>{nameStr} will not have access to your account.</h2>
                    </div>
                    <div className="flex space-x-4">
                        <Link href="/account/parent" className={buttonVariants()}>
                            Back to Dashboard
                        </Link>
                    </div>
                </>
            )}
        </main>
    )
}