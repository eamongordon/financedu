"use server";

import { eq, gt, and, lt } from "drizzle-orm";
import { courses, modules, lessons, activities, userCompletion } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";

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

export async function getCoursesWithModulesAndLessonsAndActivities() {
    const courses = await db.query.courses.findMany({
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            activities: {
                                columns: {
                                    id: true,
                                    title: true,
                                    type: true
                                },
                                orderBy: (activities, { asc }) => [asc(activities.order)]
                            },
                        },
                        orderBy: (lessons, { asc }) => [asc(lessons.order)]
                    }
                },
                orderBy: (modules, { asc }) => [asc(modules.order)],
            },
        },
    });

    return courses;
}

export async function getCourseWithModulesAndLessons(courseId: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            activities: {
                                columns: {
                                    id: true,
                                    title: true,
                                    type: true
                                },
                                orderBy: (activities, { asc }) => [asc(activities.order)]
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
                    activities: {
                        columns: {
                            id: true,
                            title: true,
                            type: true
                        },
                        orderBy: (activities, { asc }) => [asc(activities.order)]
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
            activities: {
                orderBy: (activities, { asc }) => [asc(activities.order)]
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
    });

    if (!currentActivity) {
        throw new Error("Activity not found");
    }

    const currentLessonId = currentActivity.lessonId;
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
    const currentOrder = currentActivity.order;

    // Check for next activity in the current lesson
    const nextActivity = await db.query.activities.findFirst({
        where: and(eq(activities.lessonId, currentLessonId), gt(activities.order, currentOrder)),
        orderBy: (activities, { asc }) => [asc(activities.order)]
    });

    if (nextActivity) {
        return {
            hasNext: true,
            activity: nextActivity
        };
    }

    // Check for next lesson in the current module
    const nextLesson = await db.query.lessons.findFirst({
        where: and(eq(lessons.moduleId, currentModuleId), gt(lessons.order, currentLesson.order)),
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
        with: {
            activities: {
                orderBy: (activities, { asc }) => [asc(activities.order)],
                limit: 1
            }
        }
    });

    if (nextLesson && nextLesson.activities.length) {
        return {
            hasNext: true,
            activity: nextLesson.activities[0],
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
                    activities: {
                        orderBy: (activities, { asc }) => [asc(activities.order)],
                        limit: 1
                    }
                }
            }
        }
    });

    if (nextModule && nextModule.lessons.length && nextModule.lessons[0].activities.length) {
        // Return the first activity of the first lesson of the next module
        return {
            hasNext: true,
            activity: nextModule.lessons[0].activities[0],
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
            activities: true
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
                    activities: true
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
            activities: true
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
                    activities: true
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

export async function markActivityComplete(activityId: string, correctAnswers?: number, totalQuestions?: number) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    await db.insert(userCompletion).values({
        userId,
        activityId,
        completedAt: new Date(),
        correctAnswers,
        totalQuestions,
    }).onConflictDoUpdate({
        target: [userCompletion.userId, userCompletion.activityId],
        set: {
            correctAnswers,
            totalQuestions,
            completedAt: new Date()
        }
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
            activities: {
                with: {
                    userCompletion: {
                        where: eq(userCompletion.userId, userId)
                    }
                },
                orderBy: (activities, { asc }) => [asc(activities.order)]
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
                    activities: {
                        with: {
                            userCompletion: {
                                where: eq(userCompletion.userId, userId)
                            }
                        },
                        orderBy: (activities, { asc }) => [asc(activities.order)]
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
                            activities: {
                                with: {
                                    userCompletion: {
                                        where: eq(userCompletion.userId, userId)
                                    }
                                },
                                orderBy: (activities, { asc }) => [asc(activities.order)]
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
                            activities: {
                                with: {
                                    userCompletion: {
                                        where: (userCompletion) => eq(userCompletion.userId, userId)
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

    // Find the next activity for each course
    const coursesWithNextActivity = coursesWithProgress.map(course => {
        let nextActivity = null;

        for (const moduleObj of course.modules) {
            if (nextActivity) break;
            for (const lesson of moduleObj.lessons) {
                if (nextActivity) break;
                for (const activity of lesson.activities) {
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
            course: course,
            nextActivity: nextActivity
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
            activity: {
                with: {
                    lesson: {
                        with: {
                            module: {
                                columns: {
                                    id: true,
                                    courseId: true
                                }
                            }
                        },
                        columns: {
                            id: true,
                            title: true
                        }
                    }
                },
                columns: {
                    id: true,
                    title: true,
                    type: true
                }
            },
        }
    });

    return completedActivities;
}

export async function getUserCompletion() {
    const session = await auth();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;

    const courses = await db.query.courses.findMany({
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            activities: {
                                with: {
                                    userCompletion: {
                                        where: eq(userCompletion.userId, userId)
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
