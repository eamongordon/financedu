"use server";

import { eq, and, isNotNull, exists } from "drizzle-orm";
import { users, userCompletion, parentChild } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";
import { sendChildParentInviteEmail } from "./emails";

export async function createParentChildInvite(childEmail: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    const child = await db.query.users.findFirst({
        where: eq(users.email, childEmail),
    });
    if (!child || !child.email) {
        return;
    }
    const childId = child.id;

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

    await db.insert(parentChild).values({ parentId, childId }).onConflictDoUpdate({
        target: [parentChild.parentId, parentChild.childId],
        set: { lastInvitedAt: new Date() }
    });

    return await sendChildParentInviteEmail({
        childEmail: child.email,
        parentName: nameStr,
        parentId: parentId,
    });
}

export async function resendParentChildInvite(childId: string) {
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

    const parentChildRes = await db.update(parentChild)
        .set({ lastInvitedAt: new Date() })
        .where(and(eq(parentChild.parentId, parentId), eq(parentChild.childId, childId)))
        .from(users)
        .returning({
            childEmail: users.email
        })

    if (!parentChildRes || !parentChildRes[0] || !parentChildRes[0].childEmail) {
        throw new Error("Invite not found or you are not authorized to resend this invite");
    }

    return await sendChildParentInviteEmail({
        childEmail: parentChildRes[0].childEmail,
        parentName: nameStr,
        parentId: parentId,
    });
}

export async function getParentChildInvite(parentId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const childId = session.user.id;
    const invite = await db.query.parentChild.findFirst({
        where: and(eq(parentChild.parentId, parentId), eq(parentChild.childId, childId)),
        with: {
            parent: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            }
        }
    });
    if (!invite) {
        throw new Error("Invite not found or you are not authorized to view this invite");
    }
    return invite;
}

export async function acceptParentChildInvite(parentId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const childId = session.user.id;
    await db.update(parentChild)
        .set({ acceptedAt: new Date() })
        .where(
            and(eq(parentChild.parentId, parentId), eq(parentChild.childId, childId))
        );
}

export async function rejectParentChildInvite(parentId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const childId = session.user.id;

    await db.delete(parentChild).where(
        and(eq(parentChild.parentId, parentId), eq(parentChild.childId, childId))
    );
}

export async function getParentChildren() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    const allChildren = await db.query.parentChild.findMany({
        where: and(
            eq(parentChild.parentId, parentId),
        ),
        with: {
            child: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
                }
            },
        },
    });
    return {
        approved: allChildren.filter(child => !!child.acceptedAt),
        pending: allChildren.filter(child => !child.acceptedAt).map(childParentObj => ({
            ...childParentObj,
            child: {
                email: childParentObj.child.email, //only return email for unapproved children
            }
        })),
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
            eq(parentChild.childId, childId),
            isNotNull(parentChild.acceptedAt)
        ),
        with: {
            child: {
                columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true
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
            eq(parentChild.childId, childId),
            isNotNull(parentChild.acceptedAt)
        ),
    });

    if (!relationship) {
        throw new Error("No relationship found between parent and child");
    }

    return await db.query.userCompletion.findMany({
        where: eq(userCompletion.userId, childId),
        with: {
            activity: true,
            lesson: true,
            module: true,
            course: true,
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
                    eq(parentChild.childId, childId),
                    isNotNull(parentChild.acceptedAt)
                ))
        ),
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            lessonToActivities: {
                                with: {
                                    activity: {
                                        with: {
                                            userCompletion: {
                                                where: eq(userCompletion.userId, childId)
                                            }
                                        }
                                    }
                                },
                                orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)]
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