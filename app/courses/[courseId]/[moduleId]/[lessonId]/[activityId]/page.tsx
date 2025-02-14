import { getActivity, getNextActivity } from "@/lib/actions";
import QuizComponent from "@/components/course/quiz-component";
import { CircleHelp, FileText } from "lucide-react";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ activityId: string }>,
}) {
    const { activityId } = await params;
    const activity = await getActivity(activityId);
    const nextActivity = await getNextActivity(activityId);
    console.log("activity", activity);
    console.log("nextActiviy", nextActivity);
    return (
        <main className="w-full">
            <section className="border-b flex justify-center">
                <div className="w-4/5 py-8 flex flex-row items-center gap-4">
                    {activity.type === "Quiz" ? <CircleHelp className="text-secondary" size={50} strokeWidth={1.5} /> : <FileText className="text-secondary" size={50} strokeWidth={1.5}/>}
                    <div className="flex flex-col space-y-1">
                        <h1 className="text-2xl font-bold leading-none">{activity.title}</h1>
                        <p className="font-semibold text-secondary">{activity.type}</p>
                    </div>

                </div>
                <p>{activity.description}</p>
            </section>
            {activity.type === "Article" && (
                <div className="flex justify-center py-8">
                    <div className="w-4/5">
                        <div dangerouslySetInnerHTML={{ __html: activity.content! }} />
                    </div>
                </div>
            )}
            {activity.type === "Quiz" && (
                <QuizComponent activity={activity} nextActivity={nextActivity} />
            )}
        </main>
    );
}