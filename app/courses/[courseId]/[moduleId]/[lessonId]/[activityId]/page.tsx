import { getActivity } from "@/lib/actions";
import QuizComponent from "@/components/course/quiz-component";
import { CircleHelp } from "lucide-react";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ activityId: string }>,
}) {
    const { activityId } = await params;
    const activity = await getActivity(activityId);
    console.log("activity", activity);
    return (
        <main className="w-full">
            <section className="border-b flex justify-center">
                <div className="w-4/5 py-8 flex flex-row items-center gap-4">
                    <CircleHelp className="text-secondary" size={50} strokeWidth={1.5} />
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-2xl font-bold leading-none">{activity.title}</h1>
                        <p className="font-semibold text-secondary">Quiz</p>
                    </div>

                </div>
                <p>{activity.description}</p>
            </section>
            {activity.type === "Article" && (
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-xl md:text-2xl lg:text-4xl">{activity.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: activity.content! }} />
                </div>
            )}
            {activity.type === "Quiz" && (
                <QuizComponent activity={activity} />
            )}
        </main>
    );
}