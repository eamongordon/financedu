import { getLessonWithActivities, getLessonWithActivitiesAndUserProgress, getNextLesson, getPreviousLesson } from "@/lib/actions"
import { auth } from "@/lib/auth";
import { LessonSidebar } from "@/components/course/lesson-sidebar";

interface LessonLayoutProps {
    params: Promise<{ courseId: string, moduleId: string, lessonId: string }>,
    children: React.ReactNode
}

type LessonWithActivities = Awaited<ReturnType<typeof getLessonWithActivities>>;
type LessonWithActivitiesAndUserProgress = Awaited<ReturnType<typeof getLessonWithActivitiesAndUserProgress>>;

export default async function LessonLayout({ params, children }: LessonLayoutProps) {
    const { lessonId, courseId, moduleId } = await params;
    const nextLesson = await getNextLesson(lessonId);
    const previousLesson = await getPreviousLesson(lessonId);
    const session = await auth();

    const isLoggedIn = session && session.user && session.user.id;
    const lesson = isLoggedIn
        ? await getLessonWithActivitiesAndUserProgress(lessonId)
        : await getLessonWithActivities(lessonId);

    return (
        <div className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide-border">
            {isLoggedIn ? (
                <LessonSidebar
                    lesson={lesson as LessonWithActivitiesAndUserProgress}
                    previousLesson={previousLesson}
                    nextLesson={nextLesson}
                    isLoggedIn={true}
                    moduleId={moduleId}
                    courseId={courseId}
                    lessonId={lessonId}
                />
            ) : (
                <LessonSidebar
                    lesson={lesson as LessonWithActivities}
                    previousLesson={previousLesson}
                    nextLesson={nextLesson}
                    isLoggedIn={false}
                    moduleId={moduleId}
                    courseId={courseId}
                    lessonId={lessonId}
                />
            )}
            <div className="sm:w-2/3 flex flex-col items-center mx-auto overflow-auto">
                {children}
            </div>
        </div>
    );
}