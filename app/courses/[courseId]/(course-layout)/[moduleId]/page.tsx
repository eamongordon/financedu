import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getModuleWithLessonsAndActivities, getModuleWithLessonsAndActivitiesAndUserCompletion } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { Check, CircleHelp, FileText } from "lucide-react";
import Link from "next/link";

export default async function CourseLayout({
    params,
}: {
    params: Promise<{ moduleId: string }>,
}) {
    const moduleId = (await params).moduleId;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    const moduleObj = isLoggedIn
        ? await getModuleWithLessonsAndActivitiesAndUserCompletion(moduleId)
        : await getModuleWithLessonsAndActivities(moduleId);
    return (
        <div className="w-full">
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
                                    <div className="relative">
                                        <div className={
                                            cn("border flex justify-center items-center size-8 shrink-0 rounded-md mr-4 relative",
                                                lessonToActivitiesObj.activity.userCompletion.length ? "border-primary text-primary" : "")}
                                        >
                                            {lessonToActivitiesObj.activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                                            {lessonToActivitiesObj.activity.userCompletion.length > 0 && (
                                                <div className="text-white absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full size-4 flex items-center justify-center [&_svg]:size-[11px]">
                                                    <Check />
                                                </div>
                                            )}
                                        </div>
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