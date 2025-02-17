import { getLessonWithActivities, getLessonWithActivitiesAndUserProgress, getNextLesson, getPreviousLesson } from "@/lib/actions"
import { ActivityNav } from "@/components/course/activity-nav"
import { ChartLine, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getActivity, getNextActivity, markActivityComplete } from "@/lib/actions";
import QuizComponent from "@/components/course/quiz-component";
import { CircleHelp, FileText } from "lucide-react";
import { getNextActivityLink } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

interface LessonActivityPageProps {
    params: Promise<{ courseId: string, moduleId: string, slug: string[] }>
}

type LessonWithActivitiesAndUserProgress = Awaited<ReturnType<typeof getLessonWithActivitiesAndUserProgress>>;

export default async function LessonActivityPage({ params }: LessonActivityPageProps) {
    const { courseId, moduleId, slug } = await params;
    const lessonId = slug[0];
    const activityId = slug[1];

    const nextLesson = await getNextLesson(lessonId);
    const previousLesson = await getPreviousLesson(lessonId);
    const session = await auth();

    const isLoggedIn = session && session.user && session.user.id;
    const lesson = isLoggedIn
        ? await getLessonWithActivitiesAndUserProgress(lessonId)
        : await getLessonWithActivities(lessonId);

    console.log("lessonId", lessonId);
    console.log("activityId", activityId);

    const activity = await getActivity(activityId);
    const nextActivity = await getNextActivity(activityId);
    const { href, label } = getNextActivityLink(courseId, moduleId, lessonId, nextActivity);

    if (session && session.user && session.user.id && activity.type === "Article") {
        await markActivityComplete(activityId, lessonId, moduleId, courseId);
    }

    return (
        <div className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide-border">
            <div className="sm:w-1/3 flex flex-col gap-4 items-start text-left sm:sticky top-[64px] mb-4 sm:mb-0 sm:h-[calc(100vh-64px)] overflow-auto">
                <div className="py-4 w-full border-b flex flex-row items-center gap-4 px-2 md:px-8">
                    <div className="size-12 aspect-square bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:from-[#00B5EA]/60 dark:to-[#02CF46]/60 rounded-lg flex justify-center items-center text-background">
                        <ChartLine />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                        <Link href={`/courses/${courseId}`}>
                            <h2 className="text-xl font-bold leading-none">Financial Foundations</h2>
                        </Link>
                        <Link href={`courses/${courseId}/${moduleId}`}>
                            <p className="font-semibold text-secondary leading-none">Module 6: Saving</p>
                        </Link>
                    </div>
                </div>
                <div className="w-full flex flex-row justify-between items-center px-2 md:px-8 py-3">
                    {previousLesson.lesson ? (
                        <Link
                            href={`/courses/${courseId}/${moduleId}/${previousLesson.lesson.id}`}
                            className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}
                        >
                            <ChevronLeft className="text-muted-foreground" />
                        </Link>
                    ) : (
                        <Button disabled className="[&_svg]:size-6 p-0" variant="ghost">
                            <ChevronLeft className="text-muted-foreground" />
                        </Button>
                    )}
                    <h1 className="mx-2 text-lg font-bold text-center">{lesson.title}</h1>
                    {nextLesson.lesson ? (
                        <Link
                            href={`/courses/${courseId}/${moduleId}/${nextLesson.lesson.id}`}
                            className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}
                        >
                            <ChevronRight className="text-muted-foreground" />
                        </Link>
                    ) : (
                        <Button disabled className="[&_svg]:size-6 p-0" variant="ghost">
                            <ChevronRight className="text-muted-foreground" />
                        </Button>
                    )}
                </div>
                <div className="w-full">
                    <ActivityNav activities={lesson.lessonToActivities.map(lessonToActivitiesObj => ({
                        id: lessonToActivitiesObj.activity.id,
                        type: lessonToActivitiesObj.activity.type,
                        title: lessonToActivitiesObj.activity.title,
                        href: `/courses/${courseId}/${moduleId}/${lessonId}/${lessonToActivitiesObj.activity.id}`,
                        isActive: lessonToActivitiesObj.activity.id === activityId,
                        isComplete: isLoggedIn ? ((lessonToActivitiesObj as LessonWithActivitiesAndUserProgress["lessonToActivities"][number]).activity.userCompletion.some(userProgress => userProgress.activityId === lessonToActivitiesObj.activity.id) || (lessonToActivitiesObj.activity.id === activityId && lessonToActivitiesObj.activity.type === "Article")) : undefined,
                    }))} />
                </div>
            </div>
            <div className="sm:w-2/3 flex flex-col items-center mx-auto overflow-auto">
                {!activityId ? (<></>) : (
                    <main className="w-full">
                        <section className="border-b flex justify-center">
                            <div className="w-4/5 py-8 flex flex-row items-center gap-4">
                                <div className="border size-16 flex justify-center items-center rounded-lg">
                                    {activity.type === "Quiz" ? <CircleHelp className="text-secondary" size={50} strokeWidth={1.5} /> : <FileText className="text-secondary" size={50} strokeWidth={1.5} />}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <h1 className="text-2xl font-bold leading-none">{activity.title}</h1>
                                    <p className="font-semibold text-secondary leading-none">{activity.type}</p>
                                </div>

                            </div>
                            <p>{activity.description}</p>
                        </section>
                        {activity.type === "Article" && (
                            <div className="flex flex-col items-center sm:min-h-[calc(100vh-196px)] relative">
                                <div className="py-8 w-full flex justify-center h-[calc(100vh-268px)] overflow-scroll">
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
                    </main>)}
            </div>
        </div>
    );
}
