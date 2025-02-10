import { getActivity } from "@/lib/actions";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ activityId: string }>,
}) {
    const { activityId } = await params;
    const activity = await getActivity(activityId);
    return (
        <p>Activity: {activity.title}</p>
    );
}