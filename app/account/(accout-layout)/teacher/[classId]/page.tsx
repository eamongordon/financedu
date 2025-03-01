import { AssignmentsTeacherList } from "@/components/account/assignments-teacher-list";
import { getClassTeacher } from "@/lib/actions";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const classId = (await params).classId;
    const classItem = await getClassTeacher(classId);

    const assignmentsTableData = classItem.assignments.map((assignmentObj) => ({
        assignmentId: assignmentObj.id,
        courseId: assignmentObj.courseId,
        moduleId: assignmentObj.moduleId,
        lessonId: assignmentObj.lessonId,
        activityId: assignmentObj.activity.id,
        activityType: assignmentObj.activity.type,
        activityTitle: assignmentObj.activity.title,
        dueDate: assignmentObj.dueAt,
        startDate: assignmentObj.startAt,
    }));

    return (
        <section>
            <div>
                <h2 className="text-xl font-semibold">Assignments</h2>
            </div>
            <AssignmentsTeacherList assignments={assignmentsTableData} />
        </section>
    );
}