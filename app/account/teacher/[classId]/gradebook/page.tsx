import { Gradebook } from "@/components/account/gradebook";
import { InviteStudents } from "@/components/account/invite-students";
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

    return !tableStudents.length ? (
        <div className="flex flex-col items-center justify-center mt-6 text-center gap-6">
            <div className="space-y-1">
                <p className="text-lg font-semibold mt-6">You haven&apos;t added any students yet.</p>
                <p>Once you add students and create assignments, their scores will appear here.</p>
            </div>
            <InviteStudents isNoStudents classCode={classItem.joinCode} />
        </div>
    ) : !tableAssignments.length ? (
        <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-lg font-semibold mt-6">
                You haven&apos;t created any assignments yet.
            </p>
            <p>Your gradebook will show scores once you create at least one.</p>
        </div>
    ) : (
        <Gradebook students={tableStudents} assignments={tableAssignments} />
    );
}