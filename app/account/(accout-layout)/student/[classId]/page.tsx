import { AssignmentsStudentList } from "@/components/account/assignments-student-list";
import { getClassStudent } from "@/lib/actions";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const childId = (await params).classId;
    const classItem = await getClassStudent(childId);
    return (
        <section>
            <div className="space-y-0.5 border-b pb-6">
                <h2 className="text-2xl font-bold tracking-tight">{classItem.name}</h2>
                <p className="text-muted-foreground">
                    {classItem.assignments.length} Assignment{classItem.assignments.length !== 1 && "s"}
                </p>
            </div>
            <AssignmentsStudentList assignments={classItem.assignments} />
        </section>
    );
}