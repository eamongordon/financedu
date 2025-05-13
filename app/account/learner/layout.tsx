import LearnerHeader from "@/components/account/learner/learner-header";
import { TabsNav } from "@/components/account/tabs-nav";
import { getSession } from "@/lib/auth";

const navItems = [
    {
        name: "Courses",
        href: "/account/learner",
    },
    {
        name: "Progress",
        href: "/account/learner/progress",
    },
    {
        name: "Completion",
        href: "/account/learner/completion",
    }
];

export default async function LessonLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const name = session.user.firstName;
    return (
        <main>
            <LearnerHeader name={name ?? undefined} />
            <TabsNav navItems={navItems} />
            {children}
        </main>
    );
}