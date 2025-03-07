import { getUserCompletion } from "@/lib/actions";
import { LearnerCompletion } from "@/components/account/learner-completion";

export default async function CompletionPage() {
    const courses = await getUserCompletion();
    return <LearnerCompletion courses={courses} />;
}
