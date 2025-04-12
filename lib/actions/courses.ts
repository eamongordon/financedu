"use server";

import { userCompletion } from "../db/schema";
import { db } from "../db";
import { auth } from "../auth";

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