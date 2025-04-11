import { db } from '../db';
import { posts } from '../db/schema';
import { eq } from 'drizzle-orm';

export async function getPost(slug: string) {
    return await db.query.posts.findFirst({
        where: eq(posts.slug, slug),
    });
}

export async function getPosts() {
    return await db.query.posts.findMany({
        columns: {
            slug: true,
            title: true,
            publishedAt: true,
            coverImage: true,
            excerpt: true,
        },
        orderBy: (posts, { desc }) => [desc(posts.publishedAt)]
    });
}