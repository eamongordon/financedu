import { embed } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { activities, courses, lessons, modules } from '../db/schema';
import { cosineDistance, desc, gt, sql, eq } from 'drizzle-orm';

const embeddingModel = openai.embedding('text-embedding-3-small');

const generateEmbedding = async (
  value: string,
) => {
  const embedding = await embed({
    model: embeddingModel,
    value: value,
  });
  return embedding.embedding;
};

export async function findRelevantActivities(query: string) {
  try {

    const userQueryEmbedded = await generateEmbedding(query);

    const similarity = sql<number>`1 - (${cosineDistance(
      activities.embedding,
      userQueryEmbedded,
    )})`;

    const similarActivities = await db
      .select({
        content: activities.content,
        title: activities.title,
        slug: activities.slug,
        lessonSlug: lessons.slug,
        moduleSlug: modules.slug,
        courseSlug: courses.slug,
        similarity
      })
      .from(activities)
      .leftJoin(lessons, eq(lessons.id, activities.lessonId))
      .leftJoin(modules, eq(modules.id, lessons.moduleId))
      .leftJoin(courses, eq(courses.id, modules.courseId))
      .where(gt(similarity, 0.5))
      .orderBy(t => desc(t.similarity))
      .limit(4);

    return similarActivities;

  } catch (error) {
    console.error("Error fetching relevant documents:", error);
    throw new Error("Failed to fetch relevant documents");
  }
}
