import type { Metadata } from "next";
import { TabsNav } from "@/components/account/tabs-nav";
import { getClassTeacher } from "@/lib/fetchers";
import { getSession } from "@/lib/auth";

export async function generateMetadata(
    { params }: { params: Promise<{ classId: string }> }
): Promise<Metadata> {
    const { classId } = await params
    const classItem = await getClassTeacher(classId);
    return {
        title: classItem.name
    }
}

export default async function ClassLayout({
    children,
    params
}: {
    children: React.ReactNode,
    params: Promise<{ classId: string }>
}) {
    const session = await getSession();
    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const classId = (await params).classId;

    const navItems = [
        {
            name: "Assignments",
            href: `/account/teacher/${classId}`,
        },
        {
            name: "Gradebook",
            href: `/account/teacher/${classId}/gradebook`,
        }, {
            name: "Settings",
            href: `/account/teacher/${classId}/settings`,
        }
    ];

    const classItem = await getClassTeacher(classId);

    return (
        <main>
            <div className="space-y-0.5 border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight">{classItem.name}</h2>
                <p className="text-muted-foreground">
                    {classItem.classStudents.length} Student{classItem.classStudents.length !== 1 && "s"}
                </p>
            </div>
            <TabsNav navItems={navItems} />
            {children}
        </main>
    );
}