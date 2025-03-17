"use server";

import { eq, and, exists } from "drizzle-orm";
import { userCompletion, parentChild, parentChildInvite } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";
import { sendChildParentInviteEmail } from "./emails";

export async function createParentChildInvite(childEmail: string) {
    const session = await auth();
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
    const session = await auth();
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

export async function getParentChildInvite(inviteId: string) {
    const invite = await db.query.parentChildInvite.findFirst({
        where: and(eq(parentChildInvite.id, inviteId)),
        with: {
            parent: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    image: true
                }
            }
        }
    });
    if (!invite) {
        throw new Error("Invite not found or you are not authorized to view this invite");
    }
    return invite;
}

export async function acceptParentChildInvite(inviteId: string) {
    const session = await auth();
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
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }

    await db.delete(parentChildInvite).where(eq(parentChildInvite.id, inviteId));
}

export async function deleteParentChildInvite(inviteId: string) {
    const session = await auth();
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

export async function getParentChildren() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    const approvedChildren = await db.query.parentChild.findMany({
        where: and(
            eq(parentChild.parentId, parentId),
        ),
        with: {
            child: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    image: true
                }
            },
        },
    });

    const pendingInvites = await db.query.parentChildInvite.findMany({
        where: eq(parentChildInvite.parentId, parentId),
    });

    return {
        approved: approvedChildren,
        pending: pendingInvites
    }
}

export async function getParentChildApproved(childId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    const relationship = await db.query.parentChild.findFirst({
        where: and(
            eq(parentChild.parentId, parentId),
            eq(parentChild.childId, childId)
        ),
        with: {
            child: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    image: true
                }
            },
        },
    });

    if (!relationship) {
        throw new Error("No approved relationship found between parent and child");
    }

    return relationship;
}

export async function getChildCompletedActivities(childId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    const relationship = await db.query.parentChild.findFirst({
        where: and(
            eq(parentChild.parentId, parentId),
            eq(parentChild.childId, childId)
        ),
    });

    if (!relationship) {
        throw new Error("No relationship found between parent and child");
    }

    return await db.query.userCompletion.findMany({
        where: eq(userCompletion.userId, childId),
        with: {
            activity: {
                with: {
                    lesson: {
                        with: {
                            module: {
                                with: {
                                    course: {
                                        columns: {
                                            slug: true,
                                        }
                                    }
                                },
                                columns: {
                                    slug: true,
                                }
                            },
                        },
                        columns: {
                            slug: true,
                            title: true
                        }
                    }
                },
                columns: {
                    slug: true,
                    title: true,
                    type: true
                }
            },
        },
    });
}

export async function deleteParentChildRelationship(childId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    return await db.delete(parentChild).where(
        and(eq(parentChild.parentId, parentId), eq(parentChild.childId, childId))
    );
}

export async function getChildCompletion(childId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;

    const courses = await db.query.courses.findMany({
        where: exists(
            db.select().from(parentChild).where(
                and(
                    eq(parentChild.parentId, parentId),
                    eq(parentChild.childId, childId)
                ))
        ),
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            activities: {
                                with: {
                                    userCompletion: {
                                        where: eq(userCompletion.userId, childId)
                                    }
                                },
                                orderBy: (activities, { asc }) => [asc(activities.order)]
                            }
                        },
                        orderBy: (lessons, { asc }) => [asc(lessons.order)]
                    }
                },
                orderBy: (modules, { asc }) => [asc(modules.order)]
            }
        }
    });

    return courses;
}