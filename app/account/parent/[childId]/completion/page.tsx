import { getChildCompletion } from "@/lib/actions";
import { LearnerCompletion } from "@/components/account/learner-completion";
import { NotFoundError } from "@/lib/errors";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ childId: string }>
}) {
    const childId = (await params).childId;
    let courses;
    try {
        courses = await getChildCompletion(childId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return notFound();
        }
        throw error;
    }

    return <LearnerCompletion courses={courses} />;
}
