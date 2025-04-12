import type { Metadata } from 'next';
import { CreateClass } from "@/components/account/classes/create-class";
import { Card } from "@/components/ui/card";
import { getTeacherClasses } from "@/lib/fetchers";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'My Classes'
}

export default async function TeacherPage() {
    const classes = await getTeacherClasses();
    return (
        <section>
            <div className="flex items-center justify-between gap-2 space-y-0.5 border-b pb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">My Classes</h2>
                    <p className="text-muted-foreground">
                        Setup your classes and manage your students.
                    </p>
                </div>
                <CreateClass />
            </div>
            <div>
                {classes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center mt-6">
                        <p className="text-lg font-semibold mt-6">
                            Setup your classes and manage your students.
                        </p>
                        <CreateClass isNoClasses />
                    </div>
                ) : (
                    <Card className="mt-6 divide-y">
                        {classes.map((classItem) => {
                            //const teacherName = getDisplayName(classItem., classItem.child.lastName, classItem.child.email!);
                            return (
                                <Link key={classItem.id} href={`/account/teacher/${classItem.id}`} className="flex items-center justify-between py-4 p-6">
                                    <div className="flex flex-row items-center gap-4">
                                        <div className="flex flex-col justify-start text-start gap-2">
                                            <p className="leading-none font-semibold text-lg">
                                                {classItem.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground leading-none">{classItem.classStudents.length} Student{classItem.classStudents.length !== 1 && "s"}</p>
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