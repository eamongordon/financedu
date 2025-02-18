import { buttonVariants } from "@/components/ui/button";
import { getLessonWithActivities, getLessonWithActivitiesAndUserProgress } from "@/lib/actions";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link"
import { FileText, CircleHelp } from "lucide-react";
import { CompletionIcon } from "@/components/ui/completion-icon";

type LessonWithActivitiesAndUserProgress = Awaited<ReturnType<typeof getLessonWithActivitiesAndUserProgress>>;

export default async function LessonPage({
    params,
}: {
    params: Promise<{ courseId: string, moduleId: string, lessonId: string }>,
}) {
    const courseId = (await params).courseId;
    const moduleId = (await params).moduleId;
    const lessonId = (await params).lessonId;
    const session = await auth();
    const isLoggedIn = session && session.user && session.user.id;
    const lesson = isLoggedIn ?
        await getLessonWithActivitiesAndUserProgress(lessonId) :
        await getLessonWithActivities(lessonId);

    console.log("lesson", lesson)
    return (
        <main className="p-2 sm:p-8">
            <section className="flex justify-between gap-2 md:gap-6 pb-2 md:pb-6 border-b">
                <div>
                    <p className="font-semibold">Description:</p>
                    <p>{lesson.description}</p>
                </div>
                <div>
                    <p className="font-semibold">Objectives:</p>
                    <p dangerouslySetInnerHTML={{ __html: lesson.objectives ?? "" }} />
                </div>
            </section>
            <div className="grid grid-cols-1 lg:grid-cols-2">
                {lesson.lessonToActivities.map((lessonToActivitiesObj) => (
                    <Link
                        key={lessonToActivitiesObj.activity.id}
                        href={`/courses/${courseId}/${moduleId}/${lessonId}/${lessonToActivitiesObj.activity.id}`}
                        className={cn(
                            buttonVariants({ variant: "link" }),
                            "py-8 text-base text-foreground [&_svg]:size-4 whitespace-normal justify-start gap-6",
                        )}
                    >
                        <CompletionIcon
                            isComplete={isLoggedIn ? (lessonToActivitiesObj as LessonWithActivitiesAndUserProgress["lessonToActivities"][number]).activity.userCompletion.length > 0 : false}
                            icon={lessonToActivitiesObj.activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                        />
                        {lessonToActivitiesObj.activity.title}
                    </Link>
                ))}
            </div>
        </main>
    );
}