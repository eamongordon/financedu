import { AssignmentsTeacherList } from "@/components/account/assignments-teacher-list";
import { CreateAssignments } from "@/components/account/create-assigments";
import { getClassTeacherWithAssignments, getCoursesWithModulesAndLessonsAndActivities } from "@/lib/actions";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const classId = (await params).classId;
    const classItem = await getClassTeacherWithAssignments(classId);
    const courses = await getCoursesWithModulesAndLessonsAndActivities();

    const assignmentsTableData = classItem.assignments.map((assignmentObj) => ({
        assignmentId: assignmentObj.id,
        courseId: assignmentObj.activity.lesson.module.courseId,
        moduleId: assignmentObj.activity.lesson.module.id,
        lessonId: assignmentObj.activity.lesson.id,
        activityId: assignmentObj.activity.id,
        activityType: assignmentObj.activity.type,
        activityTitle: assignmentObj.activity.title,
        dueDate: assignmentObj.dueAt,
        startDate: assignmentObj.startAt,
    }));

    return (
        <section>
            {assignmentsTableData.length > 0 ? (
                <AssignmentsTeacherList assignments={assignmentsTableData} createAssignmentsElem={<CreateAssignments courses={courses} />} />
            ) : (
                <div className="flex flex-col items-center justify-center gap-6 mt-6">
                    <p className="text-lg font-semibold">
                        You haven&apos;t created any assignments yet.
                    </p>
                    <CreateAssignments isNone courses={courses} />
                </div>
            )}
        </section>
    );
}