import { eq, gt, and, lt, inArray, ilike, SQL, gte, lte } from "drizzle-orm";
import { courses, modules, lessons, activities, userCompletion, standards, activityToStandards, glossary } from "../db/schema";
import { db } from "../db";
import { getSession } from "../auth";

export async function listCourses() {
    return await db.query.courses.findMany();
}

export async function getCourse(courseSlug: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.slug, courseSlug),
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

export async function getCourseWithModulesAndLessons(courseSlug: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.slug, courseSlug),
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            activities: {
                                columns: {
                                    id: true,
                                    slug: true,
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

    return course;
}

export async function getModuleWithLessonsAndActivities(moduleSlug: string) {
    const moduleObj = await db.query.modules.findFirst({
        where: eq(modules.slug, moduleSlug),
        with: {
            course: {
                columns: {
                    slug: true
                }
            },
            lessons: {
                with: {
                    activities: {
                        columns: {
                            id: true,
                            slug: true,
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

    return moduleObj;
}

export async function getLessonWithActivities(lessonSlug: string) {
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.slug, lessonSlug),
        with: {
            activities: {
                columns: {
                    id: true,
                    slug: true,
                    title: true,
                    type: true
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

    return lesson;
}

export async function getActivity(activitySlug: string) {
    const activity = await db.query.activities.findFirst({
        where: eq(activities.slug, activitySlug),
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

    return activity;
}

export async function getNextActivity(activitySlug: string) {
    const currentActivity = await db.query.activities.findFirst({
        where: eq(activities.slug, activitySlug),
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
                columns: {
                    slug: true
                },
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
                        columns: {
                            slug: true
                        },
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

export async function getNextLesson(lessonSlug: string) {
    const currentLesson = await db.query.lessons.findFirst({
        where: eq(lessons.slug, lessonSlug),
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
            activities: {
                orderBy: (activities, { asc }) => [asc(activities.order)],
                columns: {
                    id: true,
                    slug: true,
                    title: true,
                    type: true
                },
                limit: 1
            }
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
                    activities: {
                        orderBy: (activities, { asc }) => [asc(activities.order)],
                        columns: {
                            id: true,
                            slug: true,
                            title: true,
                            type: true
                        },
                        limit: 1
                    }
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

export async function getPreviousLesson(lessonSlug: string) {
    const currentLesson = await db.query.lessons.findFirst({
        where: eq(lessons.slug, lessonSlug),
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
            activities: {
                orderBy: (activities, { desc }) => [desc(activities.order)],
                columns: {
                    id: true,
                    slug: true,
                    title: true,
                    type: true
                },
                limit: 1
            }
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
                    activities: {
                        orderBy: (activities, { desc }) => [desc(activities.order)],
                        columns: {
                            id: true,
                            slug: true,
                            title: true,
                            type: true
                        },
                        limit: 1
                    }
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

export async function getLessonWithActivitiesAndUserProgress(lessonSlug: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.slug, lessonSlug),
        with: {
            activities: {
                columns: {
                    id: true,
                    slug: true,
                    title: true,
                    type: true
                },
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

    return lesson;
}

export async function getModuleWithLessonsAndActivitiesAndUserCompletion(moduleSlug: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const moduleObj = await db.query.modules.findFirst({
        where: eq(modules.slug, moduleSlug),
        with: {
            course: {
                columns: {
                    slug: true
                }
            },
            lessons: {
                with: {
                    activities: {
                        with: {
                            userCompletion: {
                                where: eq(userCompletion.userId, userId)
                            }
                        },
                        columns: {
                            id: true,
                            slug: true,
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

    return moduleObj;
}

export async function getCourseWithModulesAndLessonsAndUserCompletion(courseSlug: string) {
    const session = await getSession();
    if (!session || !session.user || !session.user.id) {
        throw new Error("Not authenticated");
    }
    const userId = session.user.id;
    const course = await db.query.courses.findFirst({
        where: eq(courses.slug, courseSlug),
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            activities: {
                                columns: {
                                    id: true,
                                    slug: true,
                                    title: true,
                                    type: true
                                },
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

    return course;
}

export async function getUserCoursesWithProgressAndNextActivity() {
    const session = await getSession();
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
                                columns: {
                                    id: true,
                                    slug: true,
                                    title: true,
                                    type: true
                                },
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
    const session = await getSession();
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
            },
        }
    });

    return completedActivities;
}

export async function getUserCompletion() {
    const session = await getSession();
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
                                columns: {
                                    id: true,
                                    slug: true,
                                    title: true,
                                    type: true
                                },
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

export async function getStandards(filters: { title?: string, state?: string, categories?: string[], activityId?: string, lessonId?: string, gradeLevel?: number }) {
    const conditions: SQL<unknown>[] = [];
    if (filters.title) {
        conditions.push(ilike(standards.title, `%${filters.title}%`));
    }
    if (filters.state) {
        conditions.push(eq(standards.state, filters.state));
    }
    if (filters.categories && filters.categories.length > 0) {
        conditions.push(inArray(standards.category, filters.categories));
    }
    if (filters.gradeLevel) {
        conditions.push(lte(standards.minGradeLevel, filters.gradeLevel), gte(standards.maxGradeLevel, filters.gradeLevel));
    }

    const standardsList = await db.query.standards.findMany({
        where: (standards, { exists }) => and(
            ...conditions,
            filters.activityId ? exists(
                db.select()
                    .from(activityToStandards)
                    .where(and(
                        eq(activityToStandards.activityId, filters.activityId!),
                        eq(activityToStandards.standardId, standards.id)
                    ))
            ) : undefined,
            filters.lessonId ? exists(
                db.select()
                    .from(activities)
                    .where(and(
                        eq(activities.lessonId, filters.lessonId!),
                        exists(
                            db.select()
                                .from(activityToStandards)
                                .where(and(
                                    eq(activityToStandards.activityId, activities.id),
                                    eq(activityToStandards.standardId, standards.id)
                                ))
                        )
                    ))
            ) : undefined
        ),
        with: {
            activityToStandards: {
                with: {
                    activity: {
                        columns: {
                            id: true,
                            title: true,
                            type: true,
                            slug: true
                        }
                    }
                }
            }
        }
    });

    return standardsList;
}

export async function getLessonDisplay(lessonId: string) {
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.id, lessonId),
        columns: {
            id: true,
            title: true
        }
    });
    return lesson;
}

export async function getActivityDisplay(activityId: string) {
    const activity = await db.query.activities.findFirst({
        where: eq(activities.id, activityId),
        columns: {
            id: true,
            title: true,
            type: true
        }
    });
    return activity;
}

export async function getGlossary() {
    const glossary = await db.query.glossary.findMany();
    return glossary;
}

export async function getGlossaryTerm(slug: string) {
    const term = await db.query.glossary.findFirst({
        where: eq(glossary.slug, slug)
    });

    if (!term) {
        throw new Error("Term not found");
    }

    return term;
}

/*---Metadata Functions---*/

export async function getActivityDisplayBySlug(activitySlug: string) {
    const activity = await db.query.activities.findFirst({
        where: eq(activities.slug, activitySlug),
        columns: {
            id: true,
            title: true,
            type: true
        }
    });
    return activity;
}

export async function getLessonDisplayBySlug(lessonSlug: string) {
    const lesson = await db.query.lessons.findFirst({
        where: eq(lessons.slug, lessonSlug),
        columns: {
            title: true
        }
    });
    return lesson;
}

export async function getModuleDisplayBySlug(moduleSlug: string) {
    const moduleObj = await db.query.modules.findFirst({
        where: eq(modules.slug, moduleSlug),
        columns: {
            title: true
        }
    });
    return moduleObj;
}

export async function getCourseDisplayBySlug(courseSlug: string) {
    const course = await db.query.courses.findFirst({
        where: eq(courses.slug, courseSlug),
        columns: {
            title: true
        }
    });
    return course;
}