import LearnerHeader from "@/components/account/learner-header";
import { LearnerNav } from "@/components/account/learner-tabs";
import { auth } from "@/lib/auth";

export default async function LessonLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const name = session.user.firstName;
    return (
        <main>
            <LearnerHeader name={name ?? undefined} />
            <LearnerNav />
            {children}
        </main>
    );
}