import { getActivity, getNextActivity } from "@/lib/actions";
import QuizComponent from "@/components/course/quiz-component";
import { CircleHelp, FileText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ activityId: string, lessonId: string, moduleId: string, courseId: string }>,
}) {
    const { activityId, lessonId, moduleId, courseId } = await params;
    const activity = await getActivity(activityId);
    const nextActivity = await getNextActivity(activityId);
    console.log("activity", activity);
    console.log("nextActiviy", nextActivity);
    return (
        <main className="w-full">
            <section className="border-b flex justify-center">
                <div className="w-4/5 py-8 flex flex-row items-center gap-4">
                    <div className="border size-16 flex justify-center items-center rounded-lg">
                        {activity.type === "Quiz" ? <CircleHelp className="text-secondary" size={50} strokeWidth={1.5} /> : <FileText className="text-secondary" size={50} strokeWidth={1.5} />}
                    </div>
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-2xl font-bold leading-none">{activity.title}</h1>
                        <p className="font-semibold text-secondary">{activity.type}</p>
                    </div>

                </div>
                <p>{activity.description}</p>
            </section>
            {activity.type === "Article" && (
                <div className="flex flex-col items-center sm:min-h-[calc(100vh-196px)] relative">
                    <div className="py-8 w-full flex justify-center h-[calc(100vh-268px)] overflow-scroll">
                        <div className="w-4/5" dangerouslySetInnerHTML={{ __html: activity.content! }} />
                    </div>
                    <div className="border-t w-full p-4 flex justify-end items-center absolute bottom-0">
                        <Link
                            href={
                                nextActivity.module ? `/courses/${courseId}/${nextActivity.module.id}/${nextActivity.lesson.id}/${nextActivity.lesson.lessonToActivities[0].activity.id}` :
                                    nextActivity.lesson ? `/courses/${courseId}/${moduleId}/${nextActivity.lesson.id}` :
                                        nextActivity.activity ? `/courses/${courseId}/${moduleId}/${lessonId}/${nextActivity.activity.id}` :
                                            `/courses/${nextActivity.course.id}`
                            }
                            className={buttonVariants()}
                        >
                            {nextActivity.module ?
                                `Next: Module ${nextActivity.module.order}` :
                                nextActivity.lesson ? `Next: Lesson ${nextActivity.lesson.order}` :
                                    nextActivity.activity ? `Next: ${nextActivity.activity.type}` : "All Done!"
                            }
                        </Link>
                    </div>
                </div>
            )}
            {activity.type === "Quiz" && (
                <QuizComponent activity={activity} nextActivity={nextActivity} />
            )}
        </main>
    );
}