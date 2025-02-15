import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getModuleWithLessonsAndActivities } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { CircleHelp, FileText } from "lucide-react";
import Link from "next/link";

export default async function CourseLayout({
    params,
}: {
    params: Promise<{ moduleId: string }>,
}) {
    const moduleId = (await params).moduleId;
    const moduleObj = await getModuleWithLessonsAndActivities(moduleId);
    console.log("module", moduleObj);
    return (
        <div>
            {moduleObj.lessons.map(lesson => (
                <Card key={lesson.id} className="mb-4">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">{lesson.title}</h2>
                        <p>{lesson.description}</p>
                    </CardHeader>
                    <CardContent>
                        <p dangerouslySetInnerHTML={{ __html: lesson.objectives ?? "" }} />
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {lesson.lessonToActivities.map((lessonToActivitiesObj) => (
                                <Link
                                    key={lessonToActivitiesObj.activity.id}
                                    href={`/courses/${moduleObj.courseId}/${moduleObj.id}/${lesson.id}/${lessonToActivitiesObj.activity.id}`}
                                    className={cn(
                                        buttonVariants({ variant: "link" }),
                                        "py-8 text-base text-foreground [&_svg]:size-4 whitespace-normal justify-start",
                                    )}
                                >
                                    <div className={cn("border flex justify-center items-center size-8 shrink-0 rounded-md mr-4")}>
                                        {lessonToActivitiesObj.activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                                    </div>
                                    {lessonToActivitiesObj.activity.title}
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}