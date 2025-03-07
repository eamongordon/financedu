import { Gradebook } from "@/components/account/gradebook";
import { getClassTeacherWithCompletion } from "@/lib/actions";
import { getDisplayName } from "@/lib/utils";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const classId = (await params).classId;
    const classItem = await getClassTeacherWithCompletion(classId);
    const tableStudents = classItem.classStudents.map((classStudentsObj) => ({
        studentName: getDisplayName(classStudentsObj.student.firstName, classStudentsObj.student.lastName, classStudentsObj.student.email!),
        assignments: classStudentsObj.student.userCompletion.map((userCompletionObj) => ({
            activityId: userCompletionObj.activity.id,
            completed: !!userCompletionObj.completedAt,
            accuracy: (userCompletionObj.activity.type === "Quiz" && userCompletionObj.correctAnswers && userCompletionObj.totalQuestions)
                ? (Math.round((userCompletionObj.correctAnswers / userCompletionObj.totalQuestions) * 100))
                : undefined
        })),
    }));
    const tableAssignments = classItem.assignments.map((assignmentObj) => ({
        assignmentId: assignmentObj.id,
        activityId: assignmentObj.activity.id,
        activityName: assignmentObj.activity.title,
        activityType: assignmentObj.activity.type
    }));
    return (
        <Gradebook students={tableStudents} assignments={tableAssignments} />
    );
}