import { UserProgress } from "@/components/account/learner/learner-progress";
import { getChildCompletedActivities } from "@/lib/fetchers";

export default async function Page({
    params,
}: {
    params: Promise<{ childId: string }>
}) {
    const childId = (await params).childId;
    const completedActivities = await getChildCompletedActivities(childId);
    const completedActivitiesTableData = completedActivities.map((completedActivityObj) => ({
        activitySlug: completedActivityObj.activity.slug,
        activityTitle: completedActivityObj.activity.title,
        activityType: completedActivityObj.activity.type,
        lessonTitle: completedActivityObj.activity.lesson.title,
        lessonSlug: completedActivityObj.activity.lesson.slug,
        moduleSlug: completedActivityObj.activity.lesson.module.slug,
        courseSlug: completedActivityObj.activity.lesson.module.course.slug,
        completedAt: completedActivityObj.completedAt! // Todo: Should be non-null
    }));
    return (
        <section>
            <UserProgress completedActivities={completedActivitiesTableData} />
        </section>
    );
}