import { CategoryFilter } from '@/components/search/category-filter';
import { TitleFilter } from '@/components/search/title-filter';
import { buttonVariants } from '@/components/ui/button';
import { getSearchResults, type Category } from '@/lib/actions';
import { BookOpen, CircleHelp, FileText, GraduationCap, Search } from 'lucide-react';
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';
import type { Metadata } from 'next'
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Search',
    description: 'Search for our financial education courses, modules, lessons, and activities.',
}

const Page = async (
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) => {
    const searchParams = await props.searchParams;
    const query =
        typeof searchParams.q === 'string' ? searchParams.q : undefined
    const categories =
        typeof searchParams.categories === 'string' ? searchParams.categories.split(",") : undefined

    const results = await getSearchResults({
        title: query,
        categories: categories ? categories as Category[] : ["Course", "Module", "Lesson", "Activity"]
    });

    return (
        <div>
            <main className='p-4 sm:p-8'>
                <section>
                    <TitleFilter defaultTitle={query ?? ""} />
                </section>
                <div className='flex flex-col md:flex-row'>
                    <section className='pt-2 md:pl-4 md:pr-12'>
                        <CategoryFilter defaultCategories={categories ?? ["Course", "Module", "Lesson", "Activity"]} />
                    </section>
                    <section className='flex-1'>
                        {results.length > 0 ? (
                            <div className='divide-y'>
                                {results.map((result) => (
                                    <Link
                                        className='flex flex-row items-center gap-4 py-2'
                                        key={result.id}
                                        href={result.link}
                                    >
                                        <div className='size-12 m-4 flex justify-center items-center border rounded-lg'>
                                            {result.category === 'Course' &&
                                                <GraduationCap strokeWidth={1.5} />
                                            }
                                            {result.category === 'Module' &&
                                                <DynamicIcon name={result.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} />
                                            }
                                            {result.category === 'Lesson' &&
                                                <BookOpen strokeWidth={1.5} />
                                            }
                                            {result.category === 'Activity' &&
                                                (result.activityType === 'Quiz' ? <CircleHelp strokeWidth={1.5} /> : <FileText strokeWidth={1.5} />)
                                            }
                                        </div>
                                        <div>
                                            <p className='text-lg font-semibold'>{result.title}</p>
                                            <p className='text-muted-foreground'>{result.category === "Activity" ? result.activityType : result.category}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                                <div className="flex flex-col gap-1 items-center justify-center">
                                    <Search className='text-muted-foreground' size={36} />
                                    <p className="text-lg font-semibold">No results found.</p>
                                    <p>Try removing some filters.</p>
                                </div>
                                <Link href='/search' className={buttonVariants({ variant: 'outline' })}>
                                    Clear Filters
                                </Link>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Page;
