import { db } from '../db';
import { helpCategories, helpArticles } from '../db/schema';
import { eq, asc } from 'drizzle-orm';

export async function getHelpCategories() {
    return await db.query.helpCategories.findMany({
        with: {
            articles: {
                columns: {
                    id: true,
                    slug: true,
                    title: true,
                    excerpt: true,
                    order: true,
                },
                orderBy: asc(helpArticles.order),
            },
        },
        orderBy: asc(helpCategories.order),
    });
}

export async function getHelpCategory(slug: string) {
    return await db.query.helpCategories.findFirst({
        where: eq(helpCategories.slug, slug),
        with: {
            articles: {
                orderBy: asc(helpArticles.order),
            },
        },
    });
}

export async function getHelpArticle(slug: string) {
    return await db.query.helpArticles.findFirst({
        where: eq(helpArticles.slug, slug),
        with: {
            category: true,
        },
    });
}

export async function getHelpArticlesByCategorySlug(categorySlug: string) {
    const category = await db.query.helpCategories.findFirst({
        where: eq(helpCategories.slug, categorySlug),
        with: {
            articles: {
                orderBy: asc(helpArticles.order),
            },
        },
    });
    
    return category?.articles || [];
}

export async function searchHelpArticles(query: string) {
    if (!query || query.trim().length === 0) {
        return [];
    }

    const searchTerm = `%${query.toLowerCase()}%`;
    
    return await db.query.helpArticles.findMany({
        where: (articles, { or, ilike }) => or(
            ilike(articles.title, searchTerm),
            ilike(articles.content, searchTerm),
            ilike(articles.excerpt, searchTerm)
        ),
        with: {
            category: {
                columns: {
                    slug: true,
                    name: true,
                },
            },
        },
        columns: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            updatedAt: true,
        },
    });
}
