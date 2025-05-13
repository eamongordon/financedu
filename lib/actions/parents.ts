"use server";

import { eq, and } from "drizzle-orm";
import { parentChild, parentChildInvite } from "../db/schema";
import { db } from "../db";
import { getSession } from "../auth";
import { sendChildParentInviteEmail } from "./emails";
import { getDisplayName } from "../utils";

export async function createParentChildInvite(childEmail: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;

    const nameStr = getDisplayName(session.user.firstName, session.user.lastName, session.user.email!);

    const inviteObj = await db.insert(parentChildInvite).values({ parentId, childEmail }).onConflictDoUpdate({
        target: [parentChildInvite.parentId, parentChildInvite.childEmail],
        set: { lastInvitedAt: new Date() }
    }).returning({ id: parentChildInvite.id });

    return await sendChildParentInviteEmail({
        childEmail: childEmail,
        parentName: nameStr,
        inviteId: inviteObj[0].id
    });
}

export async function resendParentChildInvite(inviteId: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;

    const hasFirstName = !!session.user.firstName;
    const hasLastName = !!session.user.lastName;
    let nameStr = '';
    if (hasFirstName) {
        nameStr += session.user.firstName;
    }
    if (hasLastName) {
        nameStr += ' ' + session.user.lastName;
    }
    if (!hasFirstName && !hasLastName) {
        nameStr = session.user.email!;
    }

    const parentChildInviteRes = await db.update(parentChildInvite)
        .set({ lastInvitedAt: new Date() })
        .where(and(eq(parentChildInvite.parentId, parentId), eq(parentChildInvite.id, inviteId)))
        .returning({
            id: parentChildInvite.id,
            childEmail: parentChildInvite.childEmail
        })

    if (!parentChildInviteRes || !parentChildInviteRes[0] || !parentChildInviteRes[0].childEmail) {
        throw new Error("Invite not found or you are not authorized to resend this invite");
    }

    return await sendChildParentInviteEmail({
        childEmail: parentChildInviteRes[0].childEmail,
        parentName: nameStr,
        inviteId: parentChildInviteRes[0].id,
    });
}

export async function acceptParentChildInvite(inviteId: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const childId = session.user.id;

    const invite = await db.query.parentChildInvite.findFirst({
        where: eq(parentChildInvite.id, inviteId),
    });

    if (!invite) {
        throw new Error("Invite not found");
    }

    await db.insert(parentChild).values({ parentId: invite.parentId, childId }).onConflictDoNothing(
        { target: [parentChild.parentId, parentChild.childId] }
    );
    await db.delete(parentChildInvite).where(eq(parentChildInvite.id, inviteId));
}

export async function rejectParentChildInvite(inviteId: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }

    await db.delete(parentChildInvite).where(eq(parentChildInvite.id, inviteId));
}

export async function deleteParentChildInvite(inviteId: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;

    const invite = await db.query.parentChildInvite.findFirst({
        where: and(eq(parentChildInvite.id, inviteId), eq(parentChildInvite.parentId, parentId)),
    });

    if (!invite) {
        throw new Error("Invite not found or you are not authorized to cancel this invite");
    }

    await db.delete(parentChildInvite).where(eq(parentChildInvite.id, inviteId));
}

export async function deleteParentChildRelationship(childId: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    return await db.delete(parentChild).where(
        and(eq(parentChild.parentId, parentId), eq(parentChild.childId, childId))
    );
}