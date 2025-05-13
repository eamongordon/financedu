import { eq, and, exists } from "drizzle-orm";
import { assignments, classes, classStudents, classTeachers, classTeacherInvite } from "../db/schema";
import { db } from "../db";
import { getSession } from "../auth";

export async function getClassStudent(classId: string) {
    const session = await getSession();
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
    const session = await getSession();
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
        where: eq(classes.joinCode, classCode),
        with: {
            classStudents: true,
        },
        columns: {
            id: true,
            name: true,
            joinCode: true
        }
    });

    return classDetails;
}


export async function getClassTeacherWithAssignments(classId: string) {
    const session = await getSession();
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
    const session = await getSession();
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
    const session = await getSession();
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
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const studentClasses = await db.query.classes.findMany({
        where: (classes, { exists }) => exists(
            db.select()
                .from(classStudents)
                .where(and(
                    eq(classStudents.classId, classes.id),
                    eq(classStudents.studentId, userId)
                ))
        ),
        with: {
            classTeachers: {
                with: {
                    teacher: {
                        columns: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                },
            }
        }
    });

    return studentClasses;
}

export async function getClassTeacherWithCompletion(classId: string) {
    const session = await getSession();
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

export async function getClassTeacherInvite(inviteId: string) {
    const session = await getSession();
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