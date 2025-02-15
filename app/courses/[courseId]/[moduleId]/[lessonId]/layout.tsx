import { getLessonWithActivities, getNextLesson } from "@/lib/actions"
import { ActivityNav } from "@/components/course/activity-nav"
import { ChartLine, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function LessonLayout({
    params,
    children,
}: {
    params: Promise<{ courseId: string, moduleId: string, lessonId: string }>,
    children: React.ReactNode
}) {
    const { courseId, moduleId, lessonId } = await params;
    const lesson = await getLessonWithActivities(lessonId);
    const nextLesson = await getNextLesson(lessonId);
    return (
        <div
            className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide-border"
        >
            <div
                className="sm:w-1/3 flex flex-col gap-4 items-start text-left sm:sticky top-[64px] mb-4 sm:mb-0 sm:h-[calc(100vh-64px)] overflow-auto"
            >
                <div className="py-4 w-full border-b flex flex-row items-center gap-4 px-2 md:px-8">
                    <div className="size-12 aspect-square bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:from-[#00B5EA]/60 dark:to-[#02CF46]/60 rounded-lg flex justify-center items-center text-background">
                        <ChartLine />
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                        <Link href={`/courses/${courseId}`}>
                            <h2 className="text-xl font-bold leading-none">Financial Foundations</h2>
                        </Link>
                        <Link href={`courses/${courseId}/${moduleId}`}>
                            <p className="font-semibold text-secondary leading-none">Module 6: Saving</p>
                        </Link>
                    </div>
                </div>
                <div className="w-full flex flex-row justify-between items-center px-2 md:px-8 py-3">
                    <Link href={nextLesson.lesson ? `/courses/${courseId}/${moduleId}/${nextLesson.lesson.id}` : ``} className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}>
                        <ChevronLeft className="text-muted-foreground" />
                    </Link>
                    <h1 className="mx-2 text-lg font-bold text-center">{lesson.title}</h1>
                    <Link href={nextLesson.lesson ? `/courses/${courseId}/${moduleId}/${nextLesson.lesson.id}` : ``} className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}>
                        <ChevronRight className="text-muted-foreground" />
                    </Link>
                </div>
                <div className="w-full">
                    <ActivityNav activities={lesson.lessonToActivities.map(lessonToActivitiesObj => ({
                        id: lessonToActivitiesObj.activity.id,
                        type: lessonToActivitiesObj.activity.type,
                        title: lessonToActivitiesObj.activity.title,
                        href: `/courses/${courseId}/${moduleId}/${lessonId}/${lessonToActivitiesObj.activity.id}`
                    }))} />
                </div>
            </div>
            <div
                className="sm:w-2/3 flex flex-col items-center mx-auto overflow-auto"
            >
                {children}
            </div>
        </div >
    );
}
