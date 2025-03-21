import { AssignmentsStudentList } from "@/components/account/assignments-student-list";
import { LeaveClassButton } from "@/components/account/leave-class";
import { getClassStudent } from "@/lib/actions";
import { NotFoundError } from "@/lib/errors";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const childId = (await params).classId;
    let classItem;
    try {
        classItem = await getClassStudent(childId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return notFound();
        }
        throw error;
    }

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