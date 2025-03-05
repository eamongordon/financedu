import { CreateClass } from "@/components/account/create-class";
import { Card } from "@/components/ui/card";
import { getStudentClasses } from "@/lib/actions";
import { getDisplayName } from "@/lib/utils";
import Link from "next/link";

export default async function StudentPage() {
    const classes = await getStudentClasses();
    return (
        <section>
            <div className="flex items-center justify-between gap-2 space-y-0.5 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Classes</h2>
                    <p className="text-muted-foreground">
                        Your current classes and assignments.
                    </p>
                </div>
                <CreateClass />
            </div>
            <div>
                {classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-6">
                        <p className="text-lg font-semibold mt-6">
                            You haven&pos;t joined any classes yet.
                        </p>
                        <CreateClass isNoChildren />
                    </div>
                ) : (
                    <Card className="mt-6 divide-y shadow-none">
                        {classes.map((classItem) => {
                            const teacherName = getDisplayName(classItem.classTeachers[0].teacher.firstName, classItem.classTeachers[0].teacher.lastName, classItem.classTeachers[0].teacher.email!);
                            return (
                                <Link key={classItem.id} href={`/account/student/${classItem.id}`} className="flex items-center justify-between py-4 p-6">
                                    <div className="flex flex-row items-center gap-4">
                                        <div className="flex flex-col justify-start text-start gap-2">
                                            <p className="leading-none font-semibold text-lg">
                                                {classItem.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground leading-none">Taught by {classItem.classTeachers.length > 1 ? `${classItem.classTeachers.length} Teacher${classItem.classTeachers.length !== 1 && "s"}` : teacherName}</p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                    </Card>
                )}
            </div>
        </section>
    )
}