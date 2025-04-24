import Banner from '@/components/banner';
import { StandardsLayout } from '@/components/standards/standards-layout';
import { auth } from '@/lib/auth';
import { getActivityDisplay, getLessonDisplay, getStandards, getTeacherClasses } from '@/lib/fetchers';
import type { Metadata } from 'next'

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
        typeof searchParams.categories === 'string' ? searchParams.categories.split(',') : undefined;
    const lessonId =
        typeof searchParams.lessonId === 'string' ? searchParams.lessonId : undefined
    const activityId =
        typeof searchParams.activityId === 'string' ? searchParams.activityId : undefined
    const gradeLevel =
        typeof searchParams.gradeLevel === 'string' ? parseInt(searchParams.gradeLevel, 10) : undefined;

    const filterObj = {
        title,
        state,
        categories,
        lessonId,
        activityId,
        gradeLevel
    };

    const standards = await getStandards(filterObj);
    const lesson = lessonId ? await getLessonDisplay(lessonId) : undefined;
    const activity = activityId ? await getActivityDisplay(activityId) : undefined;

    const session = await auth();
    const isTeacher = !!session?.user?.roles?.includes("teacher");
    const classes = isTeacher ? await getTeacherClasses() : undefined;

    return (
        <>
            <Banner title='Standards' className='from-[#4BDB7B] to-[#00B5EA]' />
            <StandardsLayout
                defaultValues={{
                    title: title ?? "",
                    state: state ?? "",
                    gradeLevel: gradeLevel?.toString() ?? "",
                    categories: categories ?? ["Credit", "Risk", "Saving", "Investment", "Earning", "Spending", "Career Technical (CTE)"],
                }}
                standards={standards}
                lesson={lesson}
                activity={activity}
                {...(isTeacher
                    ? { isTeacher, classes: classes! }
                    : { isTeacher }
                )} //todo: revisit types
            />
        </>
    )
}

export default Page;
