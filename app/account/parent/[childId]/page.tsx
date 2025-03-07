import { UserProgress } from "@/components/account/learner-progress";
import { getChildCompletedActivities } from "@/lib/actions";

export default async function Page({
    params,
}: {
    params: Promise<{ childId: string }>
}) {
    const childId = (await params).childId;
    const completedActivities = await getChildCompletedActivities(childId);
    const completedActivitiesTableData = completedActivities.map((completedActivityObj) => ({
        activityId: completedActivityObj.activity.id,
        activityTitle: completedActivityObj.activity.title,
        activityType: completedActivityObj.activity.type,
        lessonTitle: completedActivityObj.activity.lesson.title,
        lessonId: completedActivityObj.activity.lesson.id,
        moduleId: completedActivityObj.activity.lesson.module.id,
        courseId: completedActivityObj.activity.lesson.module.courseId,
        completedAt: completedActivityObj.completedAt! // Todo: Should be non-null
    }));
    return (
        <section>
            <UserProgress completedActivities={completedActivitiesTableData} />
        </section>
    );
}