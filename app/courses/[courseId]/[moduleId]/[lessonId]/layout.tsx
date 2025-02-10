import { getLessonWithActivities } from "@/lib/actions"
import { ActivityNav } from "@/components/course/activity-nav"

export default async function LessonLayout({
    params,
    children,
}: {
    params: Promise<{ courseId: string, moduleId: string, lessonId: string }>,
    children: React.ReactNode
}) {
    const { courseId, moduleId, lessonId } = await params;
    const lesson = await getLessonWithActivities(lessonId);
    return (
        <div
            className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide-muted"
        >
            <div
                className="py-4 sm:w-1/3 flex flex-col gap-4 items-start px-2 sm:px-8 text-left sm:sticky top-[64px] mb-4 sm:mb-0 sm:h-[calc(100vh-96px)] overflow-auto"
            >
                <h1 className="text-2xl font-bold">{lesson.title}</h1>
                <p className="mt-2">{lesson.description}</p>
                <div>
                    <h2 className="text-xl font-bold">Activities</h2>
                    <ActivityNav activities={lesson.lessonToActivities.map(lessonToActivitiesObj => ({
                        id: lessonToActivitiesObj.activity.id,
                        title: lessonToActivitiesObj.activity.title,
                        href: `/courses/${courseId}/${moduleId}/${lessonId}/${lessonToActivitiesObj.activity.id}`
                    }))} />
                </div>
            </div>
            <div
                className="py-4 sm:w-2/3 flex flex-col items-center mx-auto px-2 sm:px-8 overflow-auto"
            >
                {children}
            </div>
        </div >
    );
}
