"use server";

import { auth, getSession } from "../auth";

export async function updateUserPassword(newPassword: string) {
    const session = await getSession();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const ctx = await auth.$context;
    const hash = await ctx.password.hash(newPassword);
    await ctx.internalAdapter.updatePassword(session.user.id, hash);
}