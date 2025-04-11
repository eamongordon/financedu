import type { Metadata } from "next";
import { getUserCompletion } from "@/lib/fetchers";
import { LearnerCompletion } from "@/components/account/learner-completion";

export const metadata: Metadata = {
    title: 'Course Completion'
}

export default async function CompletionPage() {
    const courses = await getUserCompletion();
    return <LearnerCompletion courses={courses} />;
}
