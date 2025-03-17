"use server";

import { eq, and, exists, or } from "drizzle-orm";
import { assignments, classes, classStudents, classTeachers, classTeacherInvite } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";
import { sendClassTeacherInviteEmail } from "./emails";

export async function createClass(name: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const newClass = await db.insert(classes).values({ name }).returning();
    await db.insert(classTeachers).values({ classId: newClass[0].id, teacherId: userId });

    return newClass[0];
}

export async function updateClass(classId: string, updates: { name?: string }) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const updatedClass = await db.update(classes)
        .set(updates)
        .where(and(
            eq(classes.id, classId),
            exists(
                db.select().from(classTeachers).where(and(
                    eq(classTeachers.classId, classId),
                    eq(classTeachers.teacherId, userId)
                ))
            )
        ))
        .returning();

    if (!updatedClass.length) {
        throw new Error("Permission denied or class not found");
    }

    return updatedClass[0];
}

export async function getClassStudent(classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const studentId = session.user.id;

    const classDetails = await db.query.classes.findFirst({
        where: and(
            eq(classes.id, classId),
            exists(
                db.select().from(classStudents).where(and(
                    eq(classStudents.classId, classId),
                    eq(classStudents.studentId, studentId)
                ))
            )
        ),
        with: {
            assignments: {
                with: {
                    activity: {
                        with: {
                            lesson: {
                                with: {
                                    module: {
                                        with: {
                                            course: {
                                                columns: {
                                                    slug: true
                                                }
                                            }
                                        },
                                        columns: {
                                            slug: true,
                                        }
                                    }
                                },
                                columns: {
                                    slug: true
                                }
                            }
                        },
                        columns: {
                            slug: true,
                            title: true,
                            type: true
                        }
                    }
                }
            },
            classTeachers: true
        }
    });

    if (!classDetails) {
        throw new Error("Class not found");
    }

    return classDetails;
}

export async function getClassTeacher(classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const classDetails = await db.query.classes.findFirst({
        where: and(
            eq(classes.id, classId),
            exists(
                db.select().from(classTeachers).where(and(
                    eq(classTeachers.classId, classId),
                    eq(classTeachers.teacherId, userId)
                ))
            )
        ),
        with: {
            classStudents: true,
        }
    });

    if (!classDetails) {
        throw new Error("Class not found");
    }

    return classDetails;
}

export async function getClassFromClassCode(classCode: string) {
    const classDetails = await db.query.classes.findFirst({
        where: eq(classes.studentJoinCode, classCode),
        with: {
            classStudents: true,
        },
        columns: {
            id: true,
            name: true,
            studentJoinCode: true
        }
    });

    return classDetails;
}


export async function getClassTeacherWithAssignments(classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const classDetails = await db.query.classes.findFirst({
        where: and(
            eq(classes.id, classId),
            exists(
                db.select().from(classTeachers).where(and(
                    eq(classTeachers.classId, classId),
                    eq(classTeachers.teacherId, userId)
                ))
            )
        ),
        with: {
            assignments: {
                with: {
                    activity: {
                        with: {
                            lesson: {
                                with: {
                                    module: {
                                        with: {
                                            course: {
                                                columns: {
                                                    slug: true
                                                }
                                            }
                                        },
                                        columns: {
                                            slug: true
                                        }
                                    }
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
                    }
                }
            }
        }
    });

    if (!classDetails) {
        throw new Error("Class not found");
    }

    return classDetails;
}

export async function getClassTeacherWithRoster(classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const classDetails = await db.query.classes.findFirst({
        where: eq(classes.id, classId),
        with: {
            classStudents: {
                with: {
                    student: {
                        columns: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            image: true
                        }
                    }
                }
            },
            classTeachers: {
                with: {
                    teacher: {
                        columns: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            image: true
                        }
                    }
                }
            },
            classTeacherInvites: true
        }
    });

    const isTeacherInClass = classDetails?.classTeachers.some(ct => ct.teacherId === userId);

    if (!classDetails || !isTeacherInClass) {
        throw new Error("Class not found or permission denied");
    }

    return classDetails;
}

export async function getTeacherClasses() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const teacherClasses = await db.query.classes.findMany({
        where: (classes, { exists }) => exists(
            db.select()
                .from(classTeachers)
                .where(and(
                    eq(classTeachers.classId, classes.id),
                    eq(classTeachers.teacherId, userId)
                ))
        ),
        with: {
            classStudents: true
        }
    });

    return teacherClasses;
}

export async function getStudentClasses() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const studentClasses = await db.query.classes.findMany({
        where: (classes, { exists }) => exists(
            db.select()
                .from(classTeachers)
                .where(and(
                    eq(classTeachers.classId, classes.id),
                    eq(classTeachers.teacherId, userId)
                ))
        ),
        with: {
            classTeachers: {
                with: {
                    teacher: true
                },
            }
        }
    });

    return studentClasses;
}

export async function joinClass(joinCode: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const classDetails = await db.query.classes.findFirst({
        where: or(
            eq(classes.teacherJoinCode, joinCode),
            eq(classes.studentJoinCode, joinCode)
        ),
    });

    if (!classDetails) {
        throw new Error("Invalid join code");
    }

    if (classDetails.teacherJoinCode === joinCode) {
        // Join as a teacher
        await db.insert(classTeachers).values({ classId: classDetails.id, teacherId: userId });
        return { role: "teacher", class: classDetails };
    } else if (classDetails.studentJoinCode === joinCode) {
        // Join as a student
        await db.insert(classStudents).values({ classId: classDetails.id, studentId: userId });
        return { role: "student", class: classDetails };
    }

    throw new Error("Invalid join code");
}

export async function leaveClass(classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.delete(classTeachers).where(
        and(eq(classTeachers.classId, classId), eq(classTeachers.teacherId, userId))
    );

    await db.delete(classStudents).where(
        and(eq(classStudents.classId, classId), eq(classStudents.studentId, userId))
    );
}

export async function deleteAssignment(assignmentId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const result = await db.delete(assignments).where(and(
        eq(assignments.id, assignmentId),
        exists(
            db.select().from(classTeachers).where(and(
                eq(classTeachers.classId, assignments.classId),
                eq(classTeachers.teacherId, userId)
            ))
        )
    )).returning();

    if (!result.length) {
        throw new Error("Assignment not found or permission denied");
    }
}

export async function removeStudentFromClass(studentId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const result = await db.delete(classStudents).where(
        and(
            eq(classStudents.studentId, studentId),
            exists(
                db.select().from(classTeachers).where(eq(classTeachers.teacherId, userId))
            )
        )
    ).returning();

    if (!result.length) {
        throw new Error("Student not found or permission denied");
    }
}

export async function getClassTeacherWithCompletion(classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    //todo: fetch assignments and activities once?
    const classActivitiesCompletion = await db.query.classes.findFirst({
        where: and(
            eq(classes.id, classId),
            exists(
                db.select().from(classTeachers).where(and(
                    eq(classTeachers.classId, classId),
                    eq(classTeachers.teacherId, userId)
                ))
            )
        ),
        with: {
            assignments: {
                with: {
                    activity: true
                }
            },
            classStudents: {
                with: {
                    student: {
                        with: {
                            userCompletion: {
                                where: (userCompletion, { exists, and, eq }) => exists(
                                    db.select()
                                        .from(assignments)
                                        .where(and(
                                            eq(assignments.classId, classId),
                                            eq(assignments.activityId, userCompletion.activityId)
                                        ))
                                ),
                                with: {
                                    activity: true
                                }
                            }
                        },
                        columns: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            image: true
                        }
                    }
                }
            }
        }
    });

    if (!classActivitiesCompletion) {
        throw new Error("Class not found or permission denied");
    }

    return classActivitiesCompletion;
}

type Assignment = {
    activityId: string;
    startAt: Date;
    dueAt: Date;
};

export async function createAssignments(assignmentsArr: Assignment[], classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const newAssignments = assignmentsArr.map(assignment => ({
        activityId: assignment.activityId,
        classId: classId,
        teacherId: userId,
        startAt: assignment.startAt,
        dueAt: assignment.dueAt
    }));

    await db.insert(assignments).values(newAssignments);
}

export async function deleteClass(classId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.delete(classes).where(and(
        eq(classes.id, classId),
        exists(
            db.select().from(classTeachers).where(and(
                eq(classTeachers.classId, classId),
                eq(classTeachers.teacherId, userId)
            ))
        )
    ));
}

export async function createClassTeacherInvite(classId: string, teacherEmail: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const classDetails = await db.query.classes.findFirst({
        where: and(
            eq(classes.id, classId),
            exists(
                db.select().from(classTeachers).where(and(
                    eq(classTeachers.classId, classId),
                    eq(classTeachers.teacherId, userId)
                ))
            )
        )
    });

    if (!classDetails) {
        throw new Error("Class not found or permission denied");
    }

    const inviteObj = await db.insert(classTeacherInvite).values({ classId, teacherEmail }).onConflictDoUpdate({
        target: [classTeacherInvite.classId, classTeacherInvite.teacherEmail],
        set: { lastInvitedAt: new Date() }
    }).returning({ id: classTeacherInvite.id });

    return await sendClassTeacherInviteEmail({
        teacherEmail: teacherEmail,
        className: classDetails.name,
        inviteId: inviteObj[0].id
    });
}

export async function resendClassTeacherInvite(inviteId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }

    const invite = await db.query.classTeacherInvite.findFirst({
        where: and(eq(classTeacherInvite.id, inviteId)),
        with: {
            class: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!invite) {
        throw new Error("Invite not found or you are not authorized to resend this invite");
    }

    await db.update(classTeacherInvite)
        .set({ lastInvitedAt: new Date() })
        .where(eq(classTeacherInvite.id, inviteId));

    return await sendClassTeacherInviteEmail({
        teacherEmail: invite.teacherEmail,
        className: invite.class.name,
        inviteId: invite.id,
    });
}

export async function acceptClassTeacherInvite(inviteId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const teacherId = session.user.id;

    const invite = await db.query.classTeacherInvite.findFirst({
        where: eq(classTeacherInvite.id, inviteId),
    });

    if (!invite) {
        throw new Error("Invite not found");
    }

    await db.insert(classTeachers).values({ classId: invite.classId, teacherId }).onConflictDoNothing(
        { target: [classTeachers.classId, classTeachers.teacherId] }
    );
    await db.delete(classTeacherInvite).where(eq(classTeacherInvite.id, inviteId));
}

export async function deleteClassTeacherInvite(inviteId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }

    await db.delete(classTeacherInvite).where(eq(classTeacherInvite.id, inviteId));
}

export async function getClassTeacherInvite(inviteId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }

    const invite = await db.query.classTeacherInvite.findFirst({
        where: eq(classTeacherInvite.id, inviteId),
        with: {
            class: {
                columns: {
                    id: true,
                    name: true
                }
            }
        }
    });

    if (!invite) {
        throw new Error("Invite not found");
    }

    return invite;
}

export async function editAssignment(assignmentId: string, updates: { startAt?: Date, dueAt?: Date }) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const updatedAssignment = await db.update(assignments)
        .set(updates)
        .where(and(
            eq(assignments.id, assignmentId),
            exists(
                db.select().from(classTeachers).where(and(
                    eq(classTeachers.classId, assignments.classId),
                    eq(classTeachers.teacherId, userId)
                ))
            )
        ))
        .returning();

    if (!updatedAssignment.length) {
        throw new Error("Assignment not found or permission denied");
    }

    return updatedAssignment[0];
}
