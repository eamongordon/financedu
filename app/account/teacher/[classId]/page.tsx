import { AssignmentsTeacherList } from "@/components/account/assignments-teacher-list";
import { CreateAssignments } from "@/components/account/create-assigments";
import { getClassTeacherWithAssignments, getCoursesWithModulesAndLessonsAndActivities } from "@/lib/actions";
import { NotFoundError } from "@/lib/errors";
import { notFound } from "next/navigation";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const classId = (await params).classId;
    let classItem;
    try {
        classItem = await getClassTeacherWithAssignments(classId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return notFound();
        }
        throw error;
    }

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