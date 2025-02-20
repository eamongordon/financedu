import { LearnerNav } from "@/components/account/learner-nav";

export default async function LessonLayout({ children }: { children: React.ReactNode }) {

    return (
        <main>
            <div className="space-y-0.5 border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight">Welcome, Dude</h2>
                <p className="text-muted-foreground">
                    Great to have you here at Financedu!
                </p>
            </div>
            <LearnerNav />
            {children}
        </main>
    );
}