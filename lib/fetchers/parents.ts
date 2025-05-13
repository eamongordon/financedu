import { eq, and, exists } from "drizzle-orm";
import { userCompletion, parentChild, parentChildInvite } from "../db/schema";
import { db } from "../db";
import { getSession } from "../auth";

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

export async function getParentChildren() {
    const session = await getSession();
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
    const session = await getSession();
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
    const session = await getSession();
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
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const parentId = session.user.id;
    return await db.delete(parentChild).where(
        and(eq(parentChild.parentId, parentId), eq(parentChild.childId, childId))
    );
}

export async function getChildCompletion(childId: string) {
    const session = await getSession();
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