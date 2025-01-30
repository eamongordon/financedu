"use server";

import { eq } from "drizzle-orm";
import { db, users } from "./schema";
import { hash, compare } from "bcrypt";
import { type Roles } from "./schema";

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