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
        lessonTitle: completedActivityObj.lesson.title,
        lessonId: completedActivityObj.lesson.id,
        moduleId: completedActivityObj.module.id,
        courseId: completedActivityObj.course.id,
        completedAt: completedActivityObj.completedAt! // Todo: Should be non-null
    }));
    return (
        <section>
            <UserProgress completedActivities={completedActivitiesTableData} />
        </section>
    );
}