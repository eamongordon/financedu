import { UserProgress } from "@/components/account/learner-progress";
import { getChildCompletedActivities } from "@/lib/actions";
import { NotFoundError } from "@/lib/errors";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ childId: string }>
}) {
    const childId = (await params).childId;
    let completedActivities;
    try {
        completedActivities = await getChildCompletedActivities(childId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return notFound();
        }
        throw error;
    }

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