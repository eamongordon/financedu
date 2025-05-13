import type { Metadata } from 'next';
import { getActivity, getActivityDisplayBySlug, getNextActivity, getTeacherClasses } from "@/lib/fetchers";
import { markActivityComplete } from "@/lib/actions"
import QuizComponent from "@/components/course/quiz-component";
import { CircleHelp, FileText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getNextActivityLink } from "@/lib/utils";
import { getSession } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { notFound } from 'next/navigation';
import { CreateAssignments } from '@/components/account/classes/create-assigments';

type Props = {
    params: Promise<{ activitySlug: string, lessonSlug: string, moduleSlug: string, courseSlug: string }>,
}


export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { activitySlug } = await params
    const activity = await getActivityDisplayBySlug(activitySlug);
    return {
        title: `${activity?.title} - ${activity?.type}`,
    }
}

export default async function LessonPage({
    params,
}: Props) {
    const { activitySlug, lessonSlug, moduleSlug, courseSlug } = await params;
    const activity = await getActivity(activitySlug);

    const session = await getSession();

    if (!activity) return notFound();

    const nextActivity = await getNextActivity(activitySlug);
    const { href, label } = getNextActivityLink(courseSlug, moduleSlug, lessonSlug, nextActivity);

    if (session && session.user && session.user.id && activity.type === "Article") {
        await markActivityComplete(activity.id);
    }

    const isTeacher = session?.user?.roles?.includes("teacher");
    const classes = isTeacher ? await getTeacherClasses() : undefined;

    return (
        <main className="w-full flex-1 flex flex-col overflow-auto">
            <section className="border-b flex justify-center">
                <div className="px-4 md:px-8 lg:px-0 w-full lg:w-4/5 py-4 sm:py-8 flex flex-row items-center justify-between gap-4">
                    <div className='[&_svg]:size-8 sm:[&_svg]:size-auto flex items-center justify-center gap-4'>
                        <div className="border size-12 sm:size-16 flex justify-center items-center rounded-lg">
                            {activity.type === "Quiz" ? <CircleHelp className="text-secondary" size={50} strokeWidth={1.5} /> : <FileText className="text-secondary" size={50} strokeWidth={1.5} />}
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-xl sm:text-2xl font-bold leading-none">{activity.title}</h1>
                            <p className="font-semibold text-secondary leading-none">{activity.type}</p>
                        </div>
                    </div>
                    {isTeacher && (
                        <div>
                            <CreateAssignments type="activity" defaultSelectedActivities={[activity.id]} classes={classes!} />
                        </div>
                    )}
                </div>
                <p>{activity.description}</p>
            </section>
            {activity.type === "Article" && (
                <div className="flex-1 flex flex-col items-center overflow-auto">
                    <div className="flex-1 py-8 px-4 w-full flex justify-center overflow-auto">
                        <article className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: activity.content! }} />
                    </div>
                    <div className="border-t w-full p-4 flex justify-end items-center bg-background">
                        <Link href={href} className={buttonVariants()}>
                            {label}
                        </Link>
                    </div>
                </div>
            )}
            {activity.type === "Quiz" && (
                <SessionProvider>
                    <QuizComponent activity={activity} nextActivity={nextActivity} />
                </SessionProvider>
            )}
        </main>
    );
}