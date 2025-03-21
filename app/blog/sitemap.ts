import { db } from '@/lib/db';
import { MetadataRoute } from 'next';

const baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const posts = await db.query.posts.findMany({
        columns: {
            slug: true
        }
    })

    return [
        {
            url: `${baseUrl}/blog`
        },
        ...posts.map((posts) => ({
            url: `${baseUrl}/blog/${posts.slug}`
        })),
    ]
}