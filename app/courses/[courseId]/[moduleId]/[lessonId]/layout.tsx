import { getLessonWithActivities, getLessonWithActivitiesAndUserProgress, getNextLesson, getPreviousLesson } from "@/lib/actions"
import { ActivityNav } from "@/components/course/activity-nav"
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
import { Menu } from "lucide-react";
import { ChevronLeft, ChevronRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

interface LessonLayoutProps {
    params: Promise<{ courseId: string, moduleId: string, lessonId: string }>,
    children: React.ReactNode
}

type LessonWithActivitiesAndUserProgress = Awaited<ReturnType<typeof getLessonWithActivitiesAndUserProgress>>;

export default async function LessonLayout({ params, children }: LessonLayoutProps) {
    const { courseId, moduleId, lessonId } = await params;
    const nextLesson = await getNextLesson(lessonId);
    const previousLesson = await getPreviousLesson(lessonId);
    const session = await auth();

    const isLoggedIn = session && session.user && session.user.id;
    const lesson = isLoggedIn
        ? await getLessonWithActivitiesAndUserProgress(lessonId)
        : await getLessonWithActivities(lessonId);

    return (
        <div className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide-border">
            <div className="sm:hidden">
                <Drawer>
                    <DrawerTrigger asChild>
                        <div className="flex justify-center items-center w-full mt-2">
                            <Button variant="outline" className="w-4/5">
                                <Menu className="mr-2" /> {lesson.title}
                            </Button>
                        </div>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[calc(100vh-64px)] flex flex-col">
                        <div className="flex flex-col gap-4 items-start text-left flex-grow overflow-auto">
                            <DrawerHeader className="py-4 w-full border-b flex flex-row justify-center items-center gap-4 px-2 md:px-8">
                                <div className="size-12 aspect-square bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:from-[#00B5EA]/60 dark:to-[#02CF46]/60 rounded-lg flex justify-center items-center text-background">
                                    {lesson.module.icon ? <DynamicIcon name={lesson.module.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} /> : <GraduationCap strokeWidth={1.5} />}
                                </div>
                                <div className="flex flex-col justify-center gap-2">
                                    <Link href={`/courses/${courseId}`}>
                                        <DrawerTitle className="text-xl font-bold leading-none">{lesson.module.course.title}</DrawerTitle>
                                    </Link>
                                    <Link href={`/courses/${courseId}/${moduleId}`}>
                                        <p className="font-semibold text-secondary leading-none">{lesson.module.title}</p>
                                    </Link>
                                </div>
                            </DrawerHeader>
                            <div className="w-full flex flex-row justify-between items-center px-2 md:px-8 py-3">
                                {previousLesson.lesson ? (
                                    <Link
                                        href={`/courses/${courseId}/${moduleId}/${previousLesson.lesson.id}/${previousLesson.lesson.lessonToActivities[0].activityId}`}
                                        className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}
                                    >
                                        <ChevronLeft className="text-muted-foreground" />
                                    </Link>
                                ) : (
                                    <Button disabled className="[&_svg]:size-6 p-0" variant="ghost">
                                        <ChevronLeft className="text-muted-foreground" />
                                    </Button>
                                )}
                                <h1 className="mx-2 text-lg font-bold text-center">{lesson.title}</h1>
                                {nextLesson.lesson ? (
                                    <Link
                                        href={`/courses/${courseId}/${moduleId}/${nextLesson.lesson.id}/${nextLesson.lesson.lessonToActivities[0].activityId}`}
                                        className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}
                                    >
                                        <ChevronRight className="text-muted-foreground" />
                                    </Link>
                                ) : (
                                    <Button disabled className="[&_svg]:size-6 p-0" variant="ghost">
                                        <ChevronRight className="text-muted-foreground" />
                                    </Button>
                                )}
                            </div>
                            <div className="w-full flex-grow overflow-auto">
                                <ActivityNav activities={lesson.lessonToActivities.map(lessonToActivitiesObj => ({
                                    id: lessonToActivitiesObj.activity.id,
                                    type: lessonToActivitiesObj.activity.type,
                                    title: lessonToActivitiesObj.activity.title,
                                    href: `/courses/${courseId}/${moduleId}/${lessonId}/${lessonToActivitiesObj.activity.id}`,
                                    isComplete: isLoggedIn ? (lessonToActivitiesObj as LessonWithActivitiesAndUserProgress["lessonToActivities"][number]).activity.userCompletion.some(userProgress => userProgress.activityId === lessonToActivitiesObj.activity.id) : undefined,
                                }))} />
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
            <div className="hidden sm:flex sm:w-1/3 flex-col gap-4 items-start text-left sm:sticky top-[64px] mb-4 sm:mb-0 sm:h-[calc(100vh-64px)] overflow-auto">
                {/* Desktop content */}
                <div className="py-4 w-full border-b flex flex-row items-center gap-4 px-2 md:px-8">
                    <div className="size-12 aspect-square bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:from-[#00B5EA]/60 dark:to-[#02CF46]/60 rounded-lg flex justify-center items-center text-background">
                        {lesson.module.icon ? <DynamicIcon name={lesson.module.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} /> : <GraduationCap strokeWidth={1.5} />}
                    </div>
                    <div className="flex flex-col justify-center gap-2">
                        <Link href={`/courses/${courseId}`}>
                            <h2 className="text-xl font-bold leading-none">{lesson.module.course.title}</h2>
                        </Link>
                        <Link href={`/courses/${courseId}/${moduleId}`}>
                            <p className="font-semibold text-secondary leading-none">{lesson.module.title}</p>
                        </Link>
                    </div>
                </div>
                <div className="w-full flex flex-row justify-between items-center px-2 md:px-8 py-3">
                    {previousLesson.lesson ? (
                        <Link
                            href={`/courses/${courseId}/${moduleId}/${previousLesson.lesson.id}/${previousLesson.lesson.lessonToActivities[0].activityId}`}
                            className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}
                        >
                            <ChevronLeft className="text-muted-foreground" />
                        </Link>
                    ) : (
                        <Button disabled className="[&_svg]:size-6 p-0" variant="ghost">
                            <ChevronLeft className="text-muted-foreground" />
                        </Button>
                    )}
                    <h1 className="mx-2 text-lg font-bold text-center">{lesson.title}</h1>
                    {nextLesson.lesson ? (
                        <Link
                            href={`/courses/${courseId}/${moduleId}/${nextLesson.lesson.id}/${nextLesson.lesson.lessonToActivities[0].activityId}`}
                            className={cn(buttonVariants({ variant: "ghost" }), "[&_svg]:size-6 p-0")}
                        >
                            <ChevronRight className="text-muted-foreground" />
                        </Link>
                    ) : (
                        <Button disabled className="[&_svg]:size-6 p-0" variant="ghost">
                            <ChevronRight className="text-muted-foreground" />
                        </Button>
                    )}
                </div>
                <div className="w-full">
                    <ActivityNav activities={lesson.lessonToActivities.map(lessonToActivitiesObj => ({
                        id: lessonToActivitiesObj.activity.id,
                        type: lessonToActivitiesObj.activity.type,
                        title: lessonToActivitiesObj.activity.title,
                        href: `/courses/${courseId}/${moduleId}/${lessonId}/${lessonToActivitiesObj.activity.id}`,
                        isComplete: isLoggedIn ? (lessonToActivitiesObj as LessonWithActivitiesAndUserProgress["lessonToActivities"][number]).activity.userCompletion.some(userProgress => userProgress.activityId === lessonToActivitiesObj.activity.id) : undefined,
                    }))} />
                </div>
            </div>
            <div className="sm:w-2/3 flex flex-col items-center mx-auto overflow-auto">
                {children}
            </div>
        </div>
    );
}
