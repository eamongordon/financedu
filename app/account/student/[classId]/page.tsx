import type { Metadata } from "next";
import { AssignmentsStudentList } from "@/components/account/assignments-student-list";
import { LeaveClassButton } from "@/components/account/leave-class";
import { getClassStudent } from "@/lib/fetchers";

type Props = {
    params: Promise<{ classId: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { classId } = await params
    const classItem = await getClassStudent(classId);
    return {
        title: classItem.name
    }
}

export default async function Page({
    params,
}: Props) {
    const childId = (await params).classId;
    const classItem = await getClassStudent(childId);
    return (
        <main>
            <div className="space-y-0.5 border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight">{classItem.name}</h2>
                <p className="text-muted-foreground">
                    {classItem.assignments.length} Assignment{classItem.assignments.length !== 1 && "s"}
                </p>
            </div>
            <section className="flex flex-col divide-y divide-dashed">
                <div>
                    <AssignmentsStudentList assignments={classItem.assignments} />
                </div>
                <div className="py-8 space-y-4">
                    <h2 className="text-2xl font-semibold">Danger Zone</h2>
                    <LeaveClassButton />
                </div>
            </section>
        </main>
    );
}