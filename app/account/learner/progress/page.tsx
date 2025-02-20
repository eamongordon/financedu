import { UserProgress } from "@/components/account/learner-progress";
import { getCompletedActivities } from "@/lib/actions";

export default async function ProgressPage() {
    const completedActivities = await getCompletedActivities();

    return (
        <section>
            <UserProgress completedActivities={completedActivities} />
        </section>
    );
}