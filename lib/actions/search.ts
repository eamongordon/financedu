"use server";

import { db } from '../db';

export type Category = 'Course' | 'Module' | 'Lesson' | 'Activity';

export async function getSearchResults(filters: { title?: string, categories: Category[] }) {
    const searchQuery = filters.title && `%${filters.title}%`;

    const courseResults = filters.categories.includes('Course') ? await db.query.courses.findMany({
        where: (courses, { ilike }) => searchQuery ? ilike(courses.title, searchQuery) : undefined,
        columns: {
            id: true,
            title: true,
            slug: true,
            image: true
        },
        limit: 3
    }) : [];

    const moduleResults = filters.categories.includes('Module') ? await db.query.modules.findMany({
        where: (modules, { ilike }) => searchQuery ? ilike(modules.title, searchQuery) : undefined,
        columns: {
            id: true,
            title: true,
            slug: true,
            icon: true
        },
        with: {
            course: {
                columns: {
                    slug: true
                }
            }
        },
        limit: 3
    }) : [];

    const lessonResults = filters.categories.includes('Lesson') ? await db.query.lessons.findMany({
        where: (lessons, { ilike }) => searchQuery ? ilike(lessons.title, searchQuery) : undefined,
        columns: {
            id: true,
            title: true,
            moduleId: true,
            slug: true
        },
        with: {
            module: {
                with: {
                    course: {
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
        limit: 3
    }) : [];

    const activityResults = filters.categories.includes('Activity') ? await db.query.activities.findMany({
        where: (activities, { ilike }) => searchQuery ? ilike(activities.title, searchQuery) : undefined,
        columns: {
            id: true,
            title: true,
            slug: true
        },
        with: {
            lesson: {
                with: {
                    module: {
                        with: {
                            course: {
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
        limit: 3
    }) : [];

    const allResults = [
        ...courseResults.map(result => ({ ...result, category: 'Course', link: `/courses/${result.slug}` })),
        ...moduleResults.map(result => ({ ...result, category: 'Module', link: `/courses/${result.course.slug}/${result.slug}` })),
        ...lessonResults.map(result => ({ ...result, category: 'Lesson', link: `/courses/${result.module.course.slug}/${result.module.slug}/${result.slug}` })),
        ...activityResults.map(result => ({ ...result, category: 'Activity', link: `/courses/${result.lesson.module.course.slug}/${result.lesson.module.slug}/${result.lesson.slug}/${result.slug}` }))
    ];

    const orderedResults = allResults.sort((a, b) => {
        const aIndex = a.title.toLowerCase().indexOf(filters.title?.toLowerCase() || '');
        const bIndex = b.title.toLowerCase().indexOf(filters.title?.toLowerCase() || '');
        return aIndex - bIndex;
    });

    type Result = {
        id: string;
        title: string;
        slug: string;
        category: Category;
        image?: string;
        icon?: string;
        activityType?: string;
        link: string;
    }

    return orderedResults as Result[];
}