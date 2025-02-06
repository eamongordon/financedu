"use server";

import { eq } from "drizzle-orm";
import { courses, lessons, users, modules } from "./db/schema";
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

type CourseBase = typeof courses.$inferSelect;

type CourseWithModules = CourseBase & {
    modules: typeof modules.$inferSelect; 
};

type CourseWithModulesAndLessons = CourseBase & {
    modules: (typeof modules.$inferSelect & {
        lessons: typeof lessons.$inferSelect[];
    })[];
};

type GetCourseReturnType<T extends { includeModules?: boolean, includeLessons?: boolean }> =
    T['includeModules'] extends true
        ? T['includeLessons'] extends true
            ? CourseWithModulesAndLessons
            : CourseWithModules
        : CourseBase;

export async function getCourse<T extends { includeModules?: boolean, includeLessons?: boolean }>(
    courseId: string,
    options?: T
): Promise<GetCourseReturnType<T>> {
    const course = await db.query.courses.findFirst({
        where: eq(courses.id, courseId),
        with: options?.includeModules ? {
            modules: options.includeLessons ? {
                with: {
                    lessons: true,
                },
            } : true,
        } : undefined,
    });

    if (!course) {
        throw new Error("Course not found");
    }

    return course as GetCourseReturnType<T>;
}