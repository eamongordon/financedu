import { UserProgress } from "@/components/account/learner-progress";
import { getCompletedActivities } from "@/lib/actions";

export default async function ProgressPage() {
    const completedActivities = await getCompletedActivities();
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