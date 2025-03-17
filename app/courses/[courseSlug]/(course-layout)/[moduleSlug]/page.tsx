import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getModuleWithLessonsAndActivities, getModuleWithLessonsAndActivitiesAndUserCompletion } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CompletionIcon } from "@/components/ui/completion-icon";
import { CircleHelp, FileText } from "lucide-react";

type ModuleWithLessonsAndActivitiesAndUserCompletion = Awaited<ReturnType<typeof getModuleWithLessonsAndActivitiesAndUserCompletion>>;

export default async function CourseLayout({
    params,
}: {
    params: Promise<{ moduleSlug: string }>,
}) {
    const moduleSlug = (await params).moduleSlug;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    const moduleObj = isLoggedIn
        ? await getModuleWithLessonsAndActivitiesAndUserCompletion(moduleSlug)
        : await getModuleWithLessonsAndActivities(moduleSlug);
    return (
        <main className="pb-4 sm:py-4 w-full">
            <section className="flex flex-col gap-2 px-4 sm:px-0 pb-4 border-b">
                <h1 className="text-2xl font-bold">{moduleObj.title}</h1>
                <p>{moduleObj.description}</p>
            </section>
            <section className="pt-4 px-4 sm:px-0">
            {moduleObj.lessons.map(lesson => (
                <Card key={lesson.id} className="mb-4">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">{lesson.title}</h2>
                        <p>{lesson.description}</p>
                    </CardHeader>
                    <CardContent>
                        <p dangerouslySetInnerHTML={{ __html: lesson.objectives ?? "" }} />
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            {lesson.activities.map((activity) => (
                                <Link
                                    key={activity.id}
                                    href={`/courses/${moduleObj.slug}/${moduleObj.slug}/${lesson.slug}/${activity.slug}`}
                                    className={cn(
                                        buttonVariants({ variant: "link" }),
                                        "py-8 text-base text-foreground [&_svg]:size-4 whitespace-normal justify-start gap-6",
                                    )}
                                >
                                    <div className="relative">
                                        <CompletionIcon
                                            isComplete={(isLoggedIn && (activity as ModuleWithLessonsAndActivitiesAndUserCompletion["lessons"][number]["activities"][number]).userCompletion.length > 0) || false}
                                            icon={activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                                        />
                                    </div>
                                    {activity.title}
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