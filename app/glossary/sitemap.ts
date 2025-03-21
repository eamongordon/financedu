import { db } from '@/lib/db';
import { MetadataRoute } from 'next';

const baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const terms = await db.query.glossary.findMany({
        columns: {
            slug: true
        }
    })

    return [
        {
            url: `${baseUrl}/glossary`
        },
        ...terms.map((term) => ({
            url: `${baseUrl}/glossary/${term.slug}`
        })),
    ]
}