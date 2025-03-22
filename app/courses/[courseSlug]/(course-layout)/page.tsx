import { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompletionIcon } from "@/components/ui/completion-icon";
import { getCourseDisplayBySlug, getCourseWithModulesAndLessons, getCourseWithModulesAndLessonsAndUserCompletion } from "@/lib/actions"
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { GraduationCap } from "lucide-react";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";

type CourseWithModulesAndLessonsAndUserCompletion = Awaited<ReturnType<typeof getCourseWithModulesAndLessonsAndUserCompletion>>;

type Props = {
    params: Promise<{ courseSlug: string }>
}

export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { courseSlug } = await params
    const course = await getCourseDisplayBySlug(courseSlug);
    return {
        title: course?.title,
    }
}

export default async function Page({
    params,
}: Props) {
    const slug = (await params).courseSlug;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    const course = isLoggedIn
        ? await getCourseWithModulesAndLessonsAndUserCompletion(slug)
        : await getCourseWithModulesAndLessons(slug);

    if (!course) return notFound();

    return (
        <main>
            <section className="flex flex-col gap-2 md:gap-6 pt-4 pb-6 border-b px-4 sm:px-0">
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
            <section className="py-6 sm:py-8 px-4 sm:px-0">
                {course.modules.map(module => (
                    <Card key={module.id}
                        className={cn("mb-4", isLoggedIn && (module as NonNullable<CourseWithModulesAndLessonsAndUserCompletion>["modules"][number]).lessons.every(lesson => lesson.activities.every(activity => activity.userCompletion.length > 0)) && "border-primary")}
                    >
                        <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                            <CompletionIcon
                                isComplete={isLoggedIn ? (module as NonNullable<CourseWithModulesAndLessonsAndUserCompletion>["modules"][number]).lessons.every(lesson => lesson.activities.every(activity => activity.userCompletion.length > 0)) : false}
                                icon={module.icon ? <DynamicIcon name={module.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} /> : <GraduationCap strokeWidth={1.5} />}
                            />
                            <Link
                                href={`/courses/${course.slug}/${module.slug}`}
                                className={cn(buttonVariants({ variant: "link" }), isLoggedIn && (module as NonNullable<CourseWithModulesAndLessonsAndUserCompletion>["modules"][number]).lessons.every(lesson => lesson.activities.every(activity => activity.userCompletion.length > 0)) ? "text-primary" : "text-card-foreground")}
                            >
                                <CardTitle
                                    className="text-xl font-semibold leading-none"
                                >
                                    {module.title}
                                </CardTitle>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {module.lessons.map((lesson) => (
                                    <Link
                                        key={lesson.id}
                                        href={`/courses/${course.slug}/${module.slug}/${lesson.slug}/${lesson.activities.length > 0 ? lesson.activities[0].slug : ""}`}
                                        className={cn(
                                            buttonVariants({ variant: "link" }),
                                            "text-muted-foreground [&_svg]:size-4 whitespace-normal justify-start",
                                            isLoggedIn && (lesson as NonNullable<CourseWithModulesAndLessonsAndUserCompletion>["modules"][number]["lessons"][number]).activities.every(activity => activity.userCompletion.length > 0) && "text-primary"
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