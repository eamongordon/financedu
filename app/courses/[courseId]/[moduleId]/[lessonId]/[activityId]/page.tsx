import { getActivity, getNextActivity, markActivityComplete } from "@/lib/actions";
import QuizComponent from "@/components/course/quiz-component";
import { CircleHelp, FileText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getNextActivityLink } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ activityId: string, lessonId: string, moduleId: string, courseId: string }>,
}) {
    const { activityId, lessonId, moduleId, courseId } = await params;
    const activity = await getActivity(activityId);
    const nextActivity = await getNextActivity(activityId);
    const { href, label } = getNextActivityLink(courseId, moduleId, lessonId, nextActivity);

    const session = await auth();

    if (session && session.user && session.user.id && activity.type === "Article") {
        await markActivityComplete(activityId, lessonId, moduleId, courseId);
    }

    return (
        <main className="w-full">
            <section className="border-b flex justify-center">
                <div className="w-4/5 [&_svg]:size-8 sm:[&_svg]:size-auto py-4 sm:py-8 flex flex-row items-center gap-4">
                    <div className="border size-12 sm:size-16 flex justify-center items-center rounded-lg">
                        {activity.type === "Quiz" ? <CircleHelp className="text-secondary" size={50} strokeWidth={1.5} /> : <FileText className="text-secondary" size={50} strokeWidth={1.5} />}
                    </div>
                    <div className="flex flex-col gap-2">
                        <h1 className="text-xl sm:text-2xl font-bold leading-none">{activity.title}</h1>
                        <p className="font-semibold text-secondary leading-none">{activity.type}</p>
                    </div>

                </div>
                <p>{activity.description}</p>
            </section>
            {activity.type === "Article" && (
                <div className="flex flex-col items-center h-[calc(100dvh-194px)] sm:min-h-[calc(100vh-196px)] relative">
                    <div className="py-8 w-full flex justify-center h-[calc(100vh-266px)] sm:h-[calc(100vh-268px)] overflow-scroll">
                        <article className="w-4/5" dangerouslySetInnerHTML={{ __html: activity.content! }} />
                    </div>
                    <div className="border-t w-full p-4 flex justify-end items-center absolute bottom-0">
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