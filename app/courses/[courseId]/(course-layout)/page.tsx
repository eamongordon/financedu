import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCourseWithModulesAndLessons } from "@/lib/actions"
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
import Link from "next/link";

export default async function Page({
    params,
}: {
    params: Promise<{ courseId: string }>
}) {
    const slug = (await params).courseId;
    const course = await getCourseWithModulesAndLessons(slug);
    console.log("course", course);
    return (
        <main>
            <section className="flex flex-col gap-2 md:gap-6 pb-2 md:pb-6 border-b">
                <p>{course.description}</p>
                <div className="flex flex-row gap-10 md:gap-12">
                    <div>
                        <p className="font-semibold">Length (Hrs.):</p>
                        <p className="text-muted-foreground text-2xl">{course.courseLength}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Grade Levels:</p>
                        <p className="text-muted-foreground text-2xl">{course.gradeLevels}</p>
                    </div>
                </div>
            </section>
            <section className="pt-2 md:pt-8">
                {course.modules.map(module => (
                    <Card key={module.id} className="mb-4">
                        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                            <div className="border flex justify-center items-center size-8 shrink-0 rounded-md">
                                {module.icon ? <DynamicIcon name={module.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} /> : <GraduationCap strokeWidth={1.5} />}
                            </div>
                            <Link
                                href={`/courses/${course.id}/${module.id}`}
                                className={cn(buttonVariants({ variant: "link" }), "text-card-foreground")}
                            >
                                <CardTitle className="text-xl font-semibold leading-none">{module.title}</CardTitle>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {module.lessons.map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/courses/${course.id}/${module.id}/${lesson.id}`}
                                        className={cn(
                                            buttonVariants({ variant: "link" }),
                                            "text-muted-foreground [&_svg]:size-4 whitespace-normal justify-start",
                                        )}
                                    >
                                        {lesson.title}
                                    </Link>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </section>
        </main>
    );
}