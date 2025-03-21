import { getClassTeacherWithRoster } from "@/lib/actions/classes";
import { StudentsList } from "@/components/account/students-list";
import { getDisplayName } from "@/lib/utils";
import { ClassSettingsForm } from "@/components/account/class-settings-form";
import { auth } from "@/lib/auth";
import { LeaveClassButton } from "@/components/account/leave-class";
import { DeleteClassButton } from "@/components/account/delete-class";
import { InviteStudents } from "@/components/account/invite-students";
import { InviteTeacher } from "@/components/account/invite-teacher";
import { TeacherList } from "@/components/account/teacher-list";
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
        classItem = await getClassTeacherWithRoster(classId);
    } catch (error) {
        if (error instanceof NotFoundError) {
            return notFound();
        }
        throw error;
    }

    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id!;
    return (
        <section className="flex flex-col divide-y divide-dashed">
            <div className="pb-8">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="block text-2xl font-semibold">{classItem.classTeachers.length} Teacher{classItem.classTeachers.length !== 1 && "s"}</h2>
                    <InviteTeacher classId={classId} />
                </div>
                <TeacherList classItem={classItem} userId={userId} />
            </div>
            <div className="py-8">
                <h2 className="text-2xl font-semibold">{classItem.classStudents.length} Student{classItem.classStudents.length !== 1 && "s"}</h2>
                {
                    classItem.classStudents.length > 0 ? (
                        <StudentsList
                            students={classItem.classStudents.map(cs => ({
                                studentId: cs.student.id,
                                name: getDisplayName(cs.student.firstName, cs.student.lastName, cs.student.email!),
                                email: cs.student.email!,
                            }))}
                            inviteButtonElem={<InviteStudents classCode={classItem.studentJoinCode} />}
                        />) : (
                        <div className="flex flex-col items-center justify-center gap-4">
                            <p className="text-lg font-semibold mt-6">
                                No Students are in this class yet.
                            </p>
                            <InviteStudents isNoStudents classCode={classItem.studentJoinCode} />
                        </div>
                    )
                }
            </div>
            <div className="py-8 flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Settings</h2>
                <ClassSettingsForm defaultValues={{ name: classItem.name }} />
            </div>
            <div className="py-8 space-y-4">
                <h2 className="text-2xl font-semibold">Danger Zone</h2>
                <div className="flex flex-row gap-2">
                    <LeaveClassButton isTeacher disabled={classItem.classTeachers.length === 1} />
                    <DeleteClassButton />
                </div>
            </div>
        </section>
    );
}