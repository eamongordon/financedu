"use server";

import { eq, gt, lt, and } from "drizzle-orm";
import { courses, users, modules, lessons, activities, lessonToActivities, userCompletion } from "./db/schema";
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
                        with: {
                            lessonToActivities: {
                                orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)]
                            }
                        },
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
            },
            module: {
                with: {
                    course: true
                }
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
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
            lessonToActivities: true
        }
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
                limit: 1,
                with: {
                    lessonToActivities: true
                }
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
        orderBy: (lessons, { desc }) => [desc(lessons.order)],
        with: {
            lessonToActivities: true
        }
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
                limit: 1,
                with: {
                    lessonToActivities: true
                }
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

export async function markActivityComplete(activityId: string, lessonId: string, moduleId: string, courseId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.insert(userCompletion).values({
        userId,
        activityId,
        lessonId,
        moduleId,
        courseId,
        completedAt: new Date(),
    }).onConflictDoNothing({
        target: [userCompletion.userId, userCompletion.courseId, userCompletion.moduleId, userCompletion.lessonId, userCompletion.activityId]
    });
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
                            userCompletion: true
                        }
                    }
                },
                orderBy: (lessonToActivities, { asc }) => [asc(lessonToActivities.order)]
            },
            module: {
                with: {
                    course: true
                }
            },
            userCompletion: {
                where: eq(userCompletion.userId, userId)
            }
        }
    });

    if (!lesson) {
        throw new Error("Lesson not found");
    }

    return lesson;
}


export async function getModuleWithLessonsAndActivitiesAndUserCompletion(moduleId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const moduleObj = await db.query.modules.findFirst({
        where: eq(modules.id, moduleId),
        with: {
            lessons: {
                with: {
                    lessonToActivities: {
                        with: {
                            activity: {
                                with: {
                                    userCompletion: {
                                        where: eq(userCompletion.userId, userId)
                                    }
                                }
                            }
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

export async function getCourseWithModulesAndLessonsAndUserCompletion(courseId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
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
                                                where: eq(userCompletion.userId, userId)
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
                orderBy: (modules, { asc }) => [asc(modules.order)],
            }
        }
    });

    if (!course) {
        throw new Error("Course not found");
    }

    return course;
}

export async function getUserCoursesWithProgressAndNextActivity() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const coursesWithProgress = await db.query.courses.findMany({
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
                                                where: (userCompletion) => eq(userCompletion.userId, userId)
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

    // Find the next activity for each course
    const coursesWithNextActivity = coursesWithProgress.map(course => {
        let nextActivity = null;

        for (const moduleObj of course.modules) {
            if (nextActivity) break;
            for (const lesson of moduleObj.lessons) {
                if (nextActivity) break;
                for (const lessonToActivity of lesson.lessonToActivities) {
                    const activity = lessonToActivity.activity;
                    const userCompletion = activity.userCompletion.find(uc => uc.userId === userId);
                    if (!userCompletion) {
                        nextActivity = {
                            activity,
                            lesson,
                            module: moduleObj,
                            course
                        };
                        break;
                    }
                }
            }
        }

        return {
            ...course,
            nextActivity
        };
    });

    return coursesWithNextActivity;
}

export async function getCompletedActivities() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const completedActivities = await db.query.userCompletion.findMany({
        where: eq(userCompletion.userId, userId),
        with: {
            activity: true,
            lesson: true,
            module: true,
            course: true
        }
    });

    return completedActivities;
}