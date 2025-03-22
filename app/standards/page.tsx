import Banner from '@/components/banner';
import { StandardsFilters } from '@/components/standards/filters';
import { buttonVariants } from '@/components/ui/button';
import { getActivityDisplay, getLessonDisplay, getStandards } from '@/lib/actions';
import { BookOpen } from 'lucide-react';
import type { Metadata } from 'next'
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Standards',
    description: 'Explore worldwide localities and mines at Prospector Minerals. Find information, photos, and minerals of mineral, rock, and geology localities and mines.',
}

const Page = async (
    props: {
        searchParams: Promise<{ [key: string]: string | string[] | undefined }>
    }
) => {
    const searchParams = await props.searchParams;
    const title =
        typeof searchParams.title === 'string' ? searchParams.title : undefined
    const state =
        typeof searchParams.state === 'string' ? searchParams.state : undefined
    const categories =
        Array.isArray(searchParams.categories) && searchParams.categories.every(item => typeof item === 'string') ? searchParams.categories : undefined;
    const lessonId =
        typeof searchParams.lessonId === 'string' ? searchParams.lessonId : undefined
    const activityId =
        typeof searchParams.activityId === 'string' ? searchParams.activityId : undefined


    const filterObj = {
        title,
        state,
        categories,
        lessonId,
        activityId
    };

    const standards = await getStandards(filterObj);
    const lesson = lessonId ? await getLessonDisplay(lessonId) : undefined;
    const activity = activityId ? await getActivityDisplay(activityId) : undefined;

    return (
        <>
            <Banner title='Standards' className='from-[#4BDB7B] to-[#00B5EA]' />
            <main className='flex flex-col md:flex-row'>
                <section className='w-full md:w-1/3 min-w-[350px] bg-muted p-4 lg:p-8'>
                    <div className='md:min-w-72 mx-auto'>
                        <StandardsFilters
                            defaultValues={
                                {
                                    title: title ?? "",
                                    state: state ?? "",
                                    categories: categories ?? ["Credit", "Risk", "Saving", "Investment", "Earning", "Spending", "Career Technical (CTE)"],
                                }
                            }
                            lesson={lesson}
                            activity={activity}
                        />
                    </div>
                </section>
                <section className='w-full md:w-3/4 p-4 lg:p-8'>
                    {standards.length ? (
                        <div className='divide-y'>
                            {standards.map((standard, index) => (
                                <div key={index} className='flex flex-col gap-2 py-4 first-of-type:pt-0'>
                                    <div>
                                        <h2 className='text-lg font-semibold text-chart-1'>{standard.title}</h2>
                                        <h4 className='font-semibold text-muted-foreground'>{standard.category}</h4>
                                    </div>
                                    <div>
                                        <h4 className='font-semibold text-secondary'>Description</h4>
                                        <p>{standard.description}</p>
                                    </div>
                                    <div>
                                        <h4 className='font-semibold text-secondary'>Objectives</h4>
                                        <p dangerouslySetInnerHTML={{ __html: standard.objectives ?? "" }}></p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                            <div className="flex flex-col gap-1 items-center justify-center">
                                <BookOpen className='text-muted-foreground' strokeWidth={1.5} size={36} />
                                <p className="text-lg font-semibold">No standards found.</p>
                                <p>Try removing some filters.</p>
                            </div>
                            <Link href='/standards' className={buttonVariants({ variant: 'outline' })}>
                                Clear Filters
                            </Link>
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default Page;
