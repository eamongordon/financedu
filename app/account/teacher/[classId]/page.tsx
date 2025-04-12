import { AssignmentsTeacherList } from "@/components/account/classes/assignments-teacher-list";
import { CreateAssignments } from "@/components/account/classes/create-assigments";
import { getClassTeacherWithAssignments, getCoursesWithModulesAndLessonsAndActivities } from "@/lib/fetchers";

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
        courseSlug: assignmentObj.activity.lesson.module.course.slug,
        moduleSlug: assignmentObj.activity.lesson.module.slug,
        lessonSlug: assignmentObj.activity.lesson.slug,
        activitySlug: assignmentObj.activity.slug,
        activityType: assignmentObj.activity.type,
        activityTitle: assignmentObj.activity.title,
        dueDate: assignmentObj.dueAt,
        startDate: assignmentObj.startAt,
    }));

    return (
        <section>
            {assignmentsTableData.length > 0 ? (
                <AssignmentsTeacherList assignments={assignmentsTableData} createAssignmentsElem={<CreateAssignments type="class" courses={courses} classId={classId} />} />
            ) : (
                <div className="flex flex-col items-center justify-center gap-6 mt-6">
                    <p className="text-lg font-semibold">
                        You haven&apos;t created any assignments yet.
                    </p>
                    <CreateAssignments isNone courses={courses} type="class" classId={classId} />
                </div>
            )}
        </section>
    );
}