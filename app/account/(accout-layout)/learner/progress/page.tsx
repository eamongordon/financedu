import { UserProgress } from "@/components/account/learner-progress";
import { getCompletedActivities } from "@/lib/actions";

export default async function ProgressPage() {
    const completedActivities = await getCompletedActivities();
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