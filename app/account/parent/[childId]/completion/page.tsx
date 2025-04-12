import { getChildCompletion } from "@/lib/fetchers";
import { LearnerCompletion } from "@/components/account/learner-completion";

export default async function Page({
    params,
}: {
    params: Promise<{ childId: string }>
}) {
    const childId = (await params).childId;
    const courses = await getChildCompletion(childId);

    return <LearnerCompletion courses={courses} />;
}
