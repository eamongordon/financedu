"use server";

import { eq } from "drizzle-orm";
import { courses, users, modules, lessons } from "./db/schema";
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
    const module = await db.query.modules.findFirst({
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

    if (!module) {
        throw new Error("Module not found");
    }

    return module;
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