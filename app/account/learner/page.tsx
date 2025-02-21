import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getUserCoursesWithProgressAndNextActivity } from "@/lib/actions"
import { FileText, CircleHelp } from "lucide-react";
import Link from "next/link";

export default async function MainPage() {
    const currentCourses = await getUserCoursesWithProgressAndNextActivity()
    return (
        <section>
            {currentCourses.map((currentCourseObj) => (
                <Card key={currentCourseObj.course.id} className="mb-4">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">{currentCourseObj.course.title}</h2>
                        <p>{currentCourseObj.course.description}</p>
                    </CardHeader>
                    <CardContent>
                        {currentCourseObj.nextActivity && (
                            <>
                                <h3 className="text-lg font-semibold">Up Next</h3>
                                <Link
                                    href={`/courses/${currentCourseObj.course.id}/${currentCourseObj.nextActivity.module.id}/${currentCourseObj.nextActivity?.lesson.id}/${currentCourseObj.nextActivity.activity.id}`}
                                    className="py-4 font-semibold [&_svg]:size-6 whitespace-normal justify-start flex flex-row items-center gap-4"
                                >
                                    <div className="border flex justify-center items-center size-10 shrink-0 rounded-md relative"
                                    >
                                        {currentCourseObj.nextActivity.activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <p className="leading-none">{currentCourseObj.nextActivity.activity.title}</p>
                                        <p className="leading-none text-sm text-secondary">{currentCourseObj.nextActivity.lesson.title}</p>
                                    </div>
                                </Link>
                            </>
                        )}
                    </CardContent>
                </Card>
            ))}
        </section>
    );
}