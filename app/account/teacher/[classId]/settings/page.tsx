import { getClassTeacherWithRoster } from "@/lib/actions/classes";
import { StudentsList } from "@/components/account/students-list";
import { getDisplayName, getInitials } from "@/lib/utils";
import { ClassSettingsForm } from "@/components/account/class-settings-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { auth } from "@/lib/auth";
import { LeaveClassButton } from "@/components/account/leave-class";
import { DeleteClassButton } from "@/components/account/delete-class";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { InviteStudents } from "@/components/account/invite-students";
import { InviteTeacher } from "@/components/account/invite-teacher";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const classId = (await params).classId;
    const classItem = await getClassTeacherWithRoster(classId);
    const session = await auth();
    if (!session || !session.user) {
        throw new Error("Unauthorized");
    }
    const userId = session.user.id;
    return (
        <section className="flex flex-col divide-y divide-dashed">
            <div className="pb-8">
                <h2 className="text-2xl font-semibold">{classItem.classTeachers.length} Teacher{classItem.classTeachers.length !== 1 && "s"}</h2>
                {classItem.classTeachers.map(ct => {
                    const nameStr = getDisplayName(ct.teacher.firstName, ct.teacher.lastName, ct.teacher.email!);
                    return (
                        <div key={ct.teacherId} className="flex items-center justify-between py-4 p-6">
                            <div className="flex flex-row items-center gap-4">
                                <Avatar className="size-12">
                                    {ct.teacher.image ? (
                                        <AvatarImage src={ct.teacher.image} alt={nameStr} />
                                    ) : null}
                                    <AvatarFallback>
                                        {getInitials(nameStr) || <User className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-start text-start gap-2">
                                    <p className="leading-none font-semibold">
                                        {nameStr} {ct.teacherId === userId && "(You)"}
                                    </p>
                                    {(ct.teacher.firstName || ct.teacher.lastName) && (
                                        <p className="text-sm text-muted-foreground leading-none">{ct.teacher.email}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
                {classItem.classTeacherInvites.map(cti => {
                    return (
                        <div key={cti.id} className="flex items-center justify-between py-4 p-6">
                            <div className="flex flex-row items-center gap-4">
                                <Avatar className="size-12">
                                    <AvatarFallback>
                                        {getInitials(cti.teacherEmail) || <User className="h-4 w-4" />}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col justify-start text-start gap-2">
                                    <p className="leading-none font-semibold">
                                        {cti.teacherEmail}
                                    </p>
                                    <p className="text-sm text-muted-foreground leading-none">Pending</p>
                                </div>
                            </div>
                        </div>
                    )
                }
                )}
                <InviteTeacher classId={classId} />
            </div>
            <div className="py-8">
                <h2 className="text-2xl font-semibold">{classItem.classStudents.length} Student{classItem.classStudents.length !== 1 && "s"}</h2>
                <StudentsList
                    students={classItem.classStudents.map(cs => ({
                        studentId: cs.student.id,
                        name: getDisplayName(cs.student.firstName, cs.student.lastName, cs.student.email!),
                        email: cs.student.email!,
                    }))}
                    inviteButtonElem={<InviteStudents classCode={classItem.studentJoinCode} />}
                />
            </div>
            <div className="py-8 flex flex-col gap-4">
                <h2 className="text-2xl font-semibold">Settings</h2>
                <ClassSettingsForm defaultValues={{ name: classItem.name }} />
            </div>
            <div className="py-8 space-y-4">
                <h2 className="text-2xl font-semibold">Danger Zone</h2>
                <div className="flex flex-row gap-2">
                    {classItem.classTeachers.length > 1 ? (
                        <LeaveClassButton isTeacher />
                    ) : (
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <span>
                                        <LeaveClassButton isTeacher disabled />
                                    </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>You cannot leave a class if you are the only teacher.</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                    )}
                    <DeleteClassButton />
                </div>
            </div>
        </section>
    );
}