import { getActivity } from "@/lib/actions";
import QuizComponent from "@/components/course/quiz-component";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ activityId: string }>,
}) {
    const { activityId } = await params;
    const activity = await getActivity(activityId);
    console.log("activity", activity);
    return (
        <main>
            {activity.type === "Article" && (
                <div className="flex flex-col gap-4">
                    <h1 className="font-semibold text-xl md:text-2xl lg:text-4xl">{activity.title}</h1>
                    <div dangerouslySetInnerHTML={{ __html: activity.content! }} />
                </div>
            )}
            <p>Activity: {activity.title}</p>
            {activity.type === "Quiz" && (
                <QuizComponent activity={activity} />
            )}
        </main>
    );
}