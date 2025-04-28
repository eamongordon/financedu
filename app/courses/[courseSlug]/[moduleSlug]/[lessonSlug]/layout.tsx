import { getLessonWithActivities, getLessonWithActivitiesAndUserProgress, getNextLesson, getPreviousLesson } from "@/lib/fetchers"
import { auth } from "@/lib/auth";
import { LessonSidebar } from "@/components/course/lesson-sidebar";
import { notFound } from "next/navigation";

interface LessonLayoutProps {
    params: Promise<{ courseSlug: string, moduleSlug: string, lessonSlug: string }>,
    children: React.ReactNode
}

type LessonWithActivities = Awaited<ReturnType<typeof getLessonWithActivities>>;
type LessonWithActivitiesAndUserProgress = Awaited<ReturnType<typeof getLessonWithActivitiesAndUserProgress>>;

export default async function LessonLayout({ params, children }: LessonLayoutProps) {
    const { lessonSlug, courseSlug, moduleSlug } = await params;
    const session = await auth();

    const isLoggedIn = session && session.user && session.user.id;
    const lesson = isLoggedIn
        ? await getLessonWithActivitiesAndUserProgress(lessonSlug)
        : await getLessonWithActivities(lessonSlug);

    if (!lesson) return notFound();

    const nextLesson = await getNextLesson(lessonSlug);
    const previousLesson = await getPreviousLesson(lessonSlug);

    return (
        <div className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide-border h-[calc(100dvh-64px)]">
            {isLoggedIn ? (
                <LessonSidebar
                    lesson={lesson as LessonWithActivitiesAndUserProgress}
                    previousLesson={previousLesson}
                    nextLesson={nextLesson}
                    isLoggedIn={true}
                    moduleSlug={moduleSlug}
                    courseSlug={courseSlug}
                    lessonSlug={lessonSlug}
                />
            ) : (
                <LessonSidebar
                    lesson={lesson as LessonWithActivities}
                    previousLesson={previousLesson}
                    nextLesson={nextLesson}
                    isLoggedIn={false}
                    moduleSlug={moduleSlug}
                    courseSlug={courseSlug}
                    lessonSlug={lessonSlug}
                />
            )}
            <div className="sm:w-2/3 flex-1 flex flex-col items-center overflow-auto">
                {children}
            </div>
        </div>
    );
}