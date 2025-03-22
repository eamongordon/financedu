"use client"

import { getLessonWithActivities, getLessonWithActivitiesAndUserProgress } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { Menu, GraduationCap, ChevronLeft, ChevronRight, FileText, CircleHelp } from "lucide-react";
import Link from "next/link";
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";
import { Button, buttonVariants } from "../ui/button";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "../ui/drawer";
import { useParams } from "next/navigation";
import { getNextLesson, getPreviousLesson } from "@/lib/actions";
import { useEffect, useState } from "react";
import { usePathname } from 'next/navigation'
import { CompletionIcon } from "../ui/completion-icon";

type LessonWithActivities = Awaited<ReturnType<typeof getLessonWithActivities>>;
type LessonWithActivitiesAndUserProgress = Awaited<ReturnType<typeof getLessonWithActivitiesAndUserProgress>>;
type PreviousLesson = Awaited<ReturnType<typeof getPreviousLesson>>;
type NextLesson = Awaited<ReturnType<typeof getNextLesson>>;

interface LessonSidebarBaseProps {
    isLoggedIn: boolean;
    previousLesson: PreviousLesson;
    nextLesson: NextLesson;
    moduleSlug: string;
    courseSlug: string;
    lessonSlug: string;
}

interface LessonSidebarLoggedOutProps extends LessonSidebarBaseProps {
    isLoggedIn: false;
    lesson: LessonWithActivities;
}

interface LessonSidebarLoggedInProps extends LessonSidebarBaseProps {
    isLoggedIn: true;
    lesson: LessonWithActivitiesAndUserProgress;
}

type LessonSidebarProps = LessonSidebarLoggedOutProps | LessonSidebarLoggedInProps;

export function LessonSidebar({ lesson, lessonSlug, moduleSlug, courseSlug, isLoggedIn, nextLesson, previousLesson }: LessonSidebarProps) {
    const params = useParams<{ activitySlug: string }>();
    const activitySlug = params?.activitySlug;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

    if (!lesson) return null;

    return (
        <>
            <div className="sm:hidden">
                <Drawer
                    open={isDrawerOpen}
                    onOpenChange={setIsDrawerOpen}
                >
                    <DrawerTrigger asChild>
                        <div className="flex justify-center items-center w-full mt-4 px-4 sm:px-0">
                            <Button variant="outline" className="w-full sm:w-4/5">
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
                                    <Link href={`/courses/${courseSlug}`}>
                                        <DrawerTitle className="text-xl font-bold leading-none">{lesson.module.course.title}</DrawerTitle>
                                    </Link>
                                    <Link href={`/courses/${courseSlug}/${moduleSlug}`}>
                                        <p className="font-semibold text-secondary leading-none">{lesson.module.title}</p>
                                    </Link>
                                </div>
                            </DrawerHeader>
                            <NavigationButtons
                                lesson={lesson}
                                previousLesson={previousLesson}
                                nextLesson={nextLesson}
                                isLoggedIn={isLoggedIn}
                                moduleSlug={moduleSlug}
                                courseSlug={courseSlug}
                            />
                            <ActivityNav
                                activities={lesson.activities}
                                courseSlug={courseSlug}
                                moduleSlug={moduleSlug}
                                lessonSlug={lessonSlug}
                                activitySlug={activitySlug}
                                isLoggedIn={isLoggedIn}
                                setIsDrawerOpen={setIsDrawerOpen}
                            />
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
                        <Link href={`/courses/${courseSlug}`}>
                            <h2 className="text-xl font-bold leading-none">{lesson.module.course.title}</h2>
                        </Link>
                        <Link href={`/courses/${courseSlug}/${moduleSlug}`}>
                            <p className="font-semibold text-secondary leading-none">{lesson.module.title}</p>
                        </Link>
                    </div>
                </div>
                <NavigationButtons
                    lesson={lesson}
                    previousLesson={previousLesson}
                    nextLesson={nextLesson}
                    isLoggedIn={isLoggedIn}
                    moduleSlug={moduleSlug}
                    courseSlug={courseSlug}
                />
                <ActivityNav
                    activities={lesson.activities}
                    courseSlug={courseSlug}
                    moduleSlug={moduleSlug}
                    lessonSlug={lessonSlug}
                    activitySlug={activitySlug}
                    isLoggedIn={isLoggedIn}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
            </div>
        </>
    );
}

interface NavigationButtonsProps {
    lesson: NonNullable<LessonWithActivities | LessonWithActivitiesAndUserProgress>;
    previousLesson: PreviousLesson;
    nextLesson: NextLesson;
    isLoggedIn: boolean;
    moduleSlug: string;
    courseSlug: string;
}

function NavigationButtons({ lesson, previousLesson, nextLesson, moduleSlug, courseSlug }: NavigationButtonsProps) {
    return (
        <div className="w-full flex flex-row justify-between items-center px-2 md:px-8 py-3">
            {previousLesson.lesson ? (
                <Link
                    href={`/courses/${courseSlug}/${moduleSlug}/${previousLesson.lesson.slug}/${previousLesson.lesson.activities[0].slug}`}
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
                    href={`/courses/${courseSlug}/${moduleSlug}/${nextLesson.lesson.slug}/${nextLesson.lesson.activities[0].slug}`}
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
    );
}

interface ActivityLinkProps {
    activities: NonNullable<(LessonWithActivities | LessonWithActivitiesAndUserProgress)>["activities"];
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
    activitySlug: string | undefined;
    isLoggedIn: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
}

function ActivityNav({ activities, courseSlug, moduleSlug, lessonSlug, activitySlug, isLoggedIn, setIsDrawerOpen }: ActivityLinkProps) {
    return (
        <nav className="flex flex-col divide-y border-t border-b w-full">
            {activities.map((activity) => (
                <Link
                    key={activity.id}
                    href={`/courses/${courseSlug}/${moduleSlug}/${lessonSlug}/${activity.slug}`}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "border-l-4 border-l-transparent py-8 rounded-none text-base whitespace-normal gap-6",
                        activitySlug === activity.slug
                            ? "border-l-primary bg-accent hover:bg-muted"
                            : "",
                        "justify-start"
                    )}
                    onClick={() => activitySlug === activity.slug && setIsDrawerOpen(false)}
                >
                    <CompletionIcon
                        isComplete={isLoggedIn ? ((activitySlug === activity.slug && activity.type === "Article") || (activity as NonNullable<LessonWithActivitiesAndUserProgress>["activities"][number]).userCompletion.some(userProgress => userProgress.activityId === activity.id)) : false}
                        icon={activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                        isCurrent={activitySlug === activity.slug}
                    />
                    {activity.title}
                </Link>
            ))}
        </nav>
    );
}