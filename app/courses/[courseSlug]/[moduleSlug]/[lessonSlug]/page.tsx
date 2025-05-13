import { Metadata } from "next";
import { buttonVariants } from "@/components/ui/button";
import { getLessonWithActivitiesAndUserProgress, getLessonDisplayBySlug, getLessonWithActivities } from "@/lib/fetchers";
import { getSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import Link from "next/link"
import { FileText, CircleHelp } from "lucide-react";
import { CompletionIcon } from "@/components/ui/completion-icon";
import { notFound } from "next/navigation";

type LessonWithActivitiesAndUserProgress = Awaited<ReturnType<typeof getLessonWithActivitiesAndUserProgress>>;

type Props = {
    params: Promise<{ courseSlug: string, moduleSlug: string, lessonSlug: string }>
}


export async function generateMetadata(
    { params }: Props
): Promise<Metadata> {
    const { lessonSlug } = await params
    const lesson = await getLessonDisplayBySlug(lessonSlug);
    return {
        title: lesson?.title,
    }
}

export default async function LessonPage({
    params,
}: Props) {
    const courseId = (await params).courseSlug;
    const moduleId = (await params).moduleSlug;
    const lessonId = (await params).lessonSlug;
    const session = await getSession();
    const isLoggedIn = session && session.user && session.user.id;
    const lesson = isLoggedIn ?
        await getLessonWithActivitiesAndUserProgress(lessonId) :
        await getLessonWithActivities(lessonId);

    if (!lesson) return notFound();

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
                {lesson.activities.map((activity) => (
                    <Link
                        key={activity.id}
                        href={`/courses/${courseId}/${moduleId}/${lessonId}/${activity.slug}`}
                        className={cn(
                            buttonVariants({ variant: "link" }),
                            "py-8 text-base text-foreground [&_svg]:size-4 whitespace-normal justify-start gap-6",
                        )}
                    >
                        <CompletionIcon
                            isComplete={isLoggedIn ? (activity as NonNullable<LessonWithActivitiesAndUserProgress>["activities"][number]).userCompletion.length > 0 : false}
                            icon={activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                        />
                        {activity.title}
                    </Link>
                ))}
            </div>
        </main>
    );
}