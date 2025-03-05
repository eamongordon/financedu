import { getClassTeacherWithRoster } from "@/lib/actions/classes";
import { StudentsList } from "@/components/account/students-list";
import { getDisplayName } from "@/lib/utils";
import { ClassSettingsForm } from "@/components/account/class-settings-form";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const classId = (await params).classId;
    const classItem = await getClassTeacherWithRoster(classId);

    return (
        <section>
            <div>
                <h2 className="text-2xl font-semibold">{classItem.classStudents.length} Student{classItem.classStudents.length !== 1 && "s"}</h2>
                <StudentsList students={classItem.classStudents.map(cs => ({
                    studentId: cs.student.id,
                    name: getDisplayName(cs.student.firstName, cs.student.lastName, cs.student.email!),
                    email: cs.student.email!,
                }))} />
            </div>
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold">Settings</h2>
                <ClassSettingsForm defaultValues={{ name: classItem.name }} />
            </div>
        </section>
    );
}