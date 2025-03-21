import { db } from '@/lib/db';
import { MetadataRoute } from 'next';

const baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const courses = await db.query.courses.findMany({
        with: {
            modules: {
                with: {
                    lessons: {
                        with: {
                            activities: {
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
                    slug: true
                }
            }
        },
        columns: {
            slug: true
        }
    })

    return [
        {
            url: `${baseUrl}/courses`
        },
        ...courses.flatMap((course) => [
            {
                url: `${baseUrl}/courses/${course.slug}`
            },
            ...course.modules.flatMap((module) => [
                {
                    url: `${baseUrl}/courses/${course.slug}/${module.slug}`
                },
                ...module.lessons.flatMap((lesson) => [
                    {
                        url: `${baseUrl}/courses/${course.slug}/${module.slug}/${lesson.slug}`
                    },
                    ...lesson.activities.map((activity) => ({
                        url: `${baseUrl}/courses/${course.slug}/${module.slug}/${lesson.slug}/${activity.slug}`
                    }))
                ])
            ])
        ])
    ]
}