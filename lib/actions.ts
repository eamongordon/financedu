"use server";

import { eq, gt, lt, and } from "drizzle-orm";
import { courses, users, modules, lessons, activities, lessonToActivities, userProgress } from "./db/schema";
import { db } from "./db";
import { hash, compare } from "bcrypt";
import { type Roles } from "./db/schema";
import { auth } from "./auth";

export async function createUser({ email, password, firstName, lastName, roles }: { email: string, password: string, firstName?: string, lastName?: string, roles: Roles }) {
    const passwordHash = await hash(password, 10);
    return await db.insert(users).values({ email, password: passwordHash, firstName, lastName, roles });
}

export async function validateUser(email: string, password: string) {
    const user = await db.query.users.findFirst({
        where: eq(users.email, email),
    });
    // if user doesn't exist or password doesn't match
    if (!user || !user.password || !(await compare(password as string, user.password))) {
        throw new Error("Invalid email or password")
    }
    return user;
}

export const editUser = async (
    updates: { [key: string]: string | Roles }
) => {
    const session = await auth();
    if (!session || !session.user || !session.user.email) {
        throw new Error("Not authenticated");
    }

    const userId = session.user.id;

    if (!userId) {
        throw new Error("User ID is not defined");
    }

    for (const key in updates) {
        if (key === 'password') {
            updates[key] = await hash(updates[key] as string, 10);
        }
    }

    try {
        const response = await db.update(users)
            .set(updates)
            .where(eq(users.id, userId))
            .returning();
        return response;
    } catch (error) {
        throw error;
    }
};

export async function listCourses() {
    return await db.query.courses.findMany();
}

export async function getCourse(courseId: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
    });

    if (!course) {
        throw new Error("Course not found");
    }

    return course;
}

export async function getCourseWithModulesAndLessons(courseId: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            modules: {
                with: {
                    lessons: {
                        orderBy: (lessons, { asc }) => [asc(lessons.order)]
                    }
                },
                orderBy: (modules, { asc }) => [asc(modules.order)],
            },
        },
    });

    if (!course) {
        throw new Error("Course not found");
    }

    return course;
}

export async function getModuleWithLessonsAndActivities(moduleId: string) {
    const moduleObj = await db.query.modules.findFirst({
        where: eq(modules.id, moduleId),
        with: {
            lessons: {
                with: {
                    lessonToActivities: {
                        with: {
                            activity: true
                        },
                        orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)]
                    }
                },
                orderBy: (lessons, { asc }) => [asc(lessons.order)]
            }
        }
    });

    if (!moduleObj) {
        throw new Error("Module not found");
    }

    return moduleObj;
}

export async function getLessonWithActivities(lessonId: string) {
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            lessonToActivities: {
                with: {
                    activity: true
                },
                orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)]
            }
        }
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return lesson;
}

export async function getActivity(activityId: string) {
    const activity = await db.query.activities.findFirst({
        where: eq(activities.id, activityId),
        with: {
            activityToQuestions: {
                with: {
                    question: {
                        with: {
                            questionOptions: true,
                            matchingSubquestions: {
                                with: {
                                    correctMatchingOption: true
                                }
                            },
                            matchingOptions: true
                        }
                    }
                },
                orderBy: (activityToQuestions, { asc }) => [asc(activityToQuestions.order)]
            }
        }
    });

    if (!activity) {
        throw new Error("Activity not found");
    }

    return activity;
}

export async function getNextActivity(activityId: string) {
    const currentActivity = await db.query.activities.findFirst({
        where: eq(activities.id, activityId),
        with: {
            lessonToActivities: true
        }
    });

    if (!currentActivity || !currentActivity.lessonToActivities.length) {
        throw new Error("Activity not found or not associated with any lesson");
    }

    const currentLessonId = currentActivity.lessonToActivities[0].lessonId;
    const currentLesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, currentLessonId),
        with: {
            module: {
                with: {
                    course: true
                }
            }
        }
    });

    if (!currentLesson) {
        throw new Error("Lesson not found");
    }

    const currentModuleId = currentLesson.moduleId;
    const currentOrder = currentActivity.lessonToActivities[0].order;

    // Check for next activity in the current lesson
    const nextActivity = await db.query.lessonToActivities.findFirst({
        where: and(eq(lessonToActivities.lessonId, currentLessonId), gt(lessonToActivities.order, currentOrder)),
        orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)],
        with: {
            activity: true
        }
    });

    if (nextActivity) {
        return {
            hasNext: true,
            activity: nextActivity.activity
        };
    }

    // Check for next lesson in the current module
    const nextLesson = await db.query.lessons.findFirst({
        where: and(eq(lessons.moduleId, currentModuleId), gt(lessons.order, currentLesson.order)),
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
            lessonToActivities: {
                orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)],
                limit: 1,
                with: {
                    activity: true
                }
            }
        }
    });

    if (nextLesson && nextLesson.lessonToActivities.length) {
        return {
            hasNext: true,
            activity: nextLesson.lessonToActivities[0].activity,
            lesson: nextLesson
        };
    }

    // Check for next module in the current course
    const nextModule = await db.query.modules.findFirst({
        where: and(eq(modules.courseId, currentLesson.module.courseId), gt(modules.order, currentLesson.module.order)),
        orderBy: (modules, { asc }) => [asc(modules.order)],
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                limit: 1,
                with: {
                    lessonToActivities: {
                        orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)],
                        limit: 1,
                        with: {
                            activity: true
                        }
                    }
                }
            }
        }
    });

    if (nextModule && nextModule.lessons.length && nextModule.lessons[0].lessonToActivities.length) {
        // Return the first activity of the first lesson of the next module
        return {
            hasNext: true,
            activity: nextModule.lessons[0].lessonToActivities[0].activity,
            lesson: nextModule.lessons[0],
            module: nextModule
        };
    } else {
        // Done with the course, return the course
        return {
            hasNext: false,
            course: currentLesson.module.course
        };
    }
}

export async function getNextLesson(lessonId: string) {
    const currentLesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            module: {
                with: {
                    course: true
                }
            }
        }
    });

    if (!currentLesson) {
        throw new Error("Lesson not found");
    }

    const currentModuleId = currentLesson.moduleId;
    const currentOrder = currentLesson.order;

    // Check for next lesson in the current module
    const nextLesson = await db.query.lessons.findFirst({
        where: and(eq(lessons.moduleId, currentModuleId), gt(lessons.order, currentOrder)),
        orderBy: (lessons, { asc }) => [asc(lessons.order)]
    });

    if (nextLesson) {
        return {
            hasNext: true,
            lesson: nextLesson
        };
    }

    // Check for next module in the current course
    const nextModule = await db.query.modules.findFirst({
        where: and(eq(modules.courseId, currentLesson.module.courseId), gt(modules.order, currentLesson.module.order)),
        orderBy: (modules, { asc }) => [asc(modules.order)],
        with: {
            lessons: {
                orderBy: (lessons, { asc }) => [asc(lessons.order)],
                limit: 1
            }
        }
    });

    if (nextModule && nextModule.lessons.length) {
        // Return the first lesson of the next module
        return {
            hasNext: true,
            lesson: nextModule.lessons[0],
            module: nextModule
        }
    } else {
        // Done with the course, return the course
        return {
            hasNext: false,
            course: currentLesson.module.course
        };
    }
}

export async function getPreviousLesson(lessonId: string) {
    const currentLesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            module: {
                with: {
                    course: true
                }
            }
        }
    });

    if (!currentLesson) {
        throw new Error("Lesson not found");
    }

    // Check for previous lesson in the current module
    const previousLesson = await db.query.lessons.findFirst({
        where: and(eq(lessons.moduleId, currentLesson.moduleId), lt(lessons.order, currentLesson.order)),
        orderBy: (lessons, { desc }) => [desc(lessons.order)]
    });

    if (previousLesson) {
        return {
            hasPrevious: true,
            lesson: previousLesson
        };
    }

    // Check for previous module in the current course
    const previousModule = await db.query.modules.findFirst({
        where: and(eq(modules.courseId, currentLesson.module.courseId), lt(modules.order, currentLesson.module.order)),
        orderBy: (modules, { desc }) => [desc(modules.order)],
        with: {
            lessons: {
                orderBy: (lessons, { desc }) => [desc(lessons.order)],
                limit: 1
            }
        }
    });

    if (previousModule && previousModule.lessons.length) {
        // Return the last lesson of the previous module
        return {
            hasPrevious: true,
            lesson: previousModule.lessons[0],
            module: previousModule
        }
    } else {
        // No previous lesson or module, return the course
        return {
            hasPrevious: false,
            course: currentLesson.module.course
        };
    }
}

export async function trackUserProgress(courseId: string, moduleId?: string, lessonId?: string, activityId?: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const existingProgress = await db.query.userProgress.findFirst({
        where: and(
            eq(userProgress.userId, userId),
            eq(userProgress.courseId, courseId),
            moduleId ? eq(userProgress.moduleId, moduleId) : undefined,
            lessonId ? eq(userProgress.lessonId, lessonId) : undefined,
            activityId ? eq(userProgress.activityId, activityId) : undefined
        )
    });

    if (!existingProgress) {
        await db.insert(userProgress).values({
            userId,
            courseId,
            moduleId,
            lessonId,
            activityId,
            completedAt: activityId ? null : new Date(),
        });
    }
}

export async function markActivityComplete(activityId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.update(userProgress)
        .set({ completedAt: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.activityId, activityId)));
}

export async function markLessonComplete(lessonId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.update(userProgress)
        .set({ completedAt: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.lessonId, lessonId)));
}

export async function markModuleComplete(moduleId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.update(userProgress)
        .set({ completedAt: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleId, moduleId)));
}

export async function markCourseComplete(courseId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.update(userProgress)
        .set({ completedAt: new Date() })
        .where(and(eq(userProgress.userId, userId), eq(userProgress.courseId, courseId)));
}

export async function getLessonWithActivitiesAndUserProgress(lessonId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        with: {
            lessonToActivities: {
                with: {
                    activity: {
                        with: {
                            userProgress: true
                        }
                    }
                },
                orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)]
            },
            userProgress: {
                where: eq(userProgress.userId, userId)
            }
        }
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return lesson;
}
