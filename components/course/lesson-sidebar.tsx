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
    moduleId: string;
    courseId: string;
    lessonId: string;
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

export function LessonSidebar({ lesson, lessonId, moduleId, courseId, isLoggedIn, nextLesson, previousLesson }: LessonSidebarProps) {
    const params = useParams<{ activityId: string }>();
    const activityId = params?.activityId;
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setIsDrawerOpen(false);
    }, [pathname]);

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
                                    <Link href={`/courses/${courseId}`}>
                                        <DrawerTitle className="text-xl font-bold leading-none">{lesson.module.course.title}</DrawerTitle>
                                    </Link>
                                    <Link href={`/courses/${courseId}/${moduleId}`}>
                                        <p className="font-semibold text-secondary leading-none">{lesson.module.title}</p>
                                    </Link>
                                </div>
                            </DrawerHeader>
                            <NavigationButtons
                                lesson={lesson}
                                previousLesson={previousLesson}
                                nextLesson={nextLesson}
                                isLoggedIn={isLoggedIn}
                                moduleId={moduleId}
                                courseId={courseId}
                            />
                            <ActivityNav
                                lessonToActivities={lesson.lessonToActivities}
                                courseId={courseId}
                                moduleId={moduleId}
                                lessonId={lessonId}
                                activityId={activityId}
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
                        <Link href={`/courses/${courseId}`}>
                            <h2 className="text-xl font-bold leading-none">{lesson.module.course.title}</h2>
                        </Link>
                        <Link href={`/courses/${courseId}/${moduleId}`}>
                            <p className="font-semibold text-secondary leading-none">{lesson.module.title}</p>
                        </Link>
                    </div>
                </div>
                <NavigationButtons
                    lesson={lesson}
                    previousLesson={previousLesson}
                    nextLesson={nextLesson}
                    isLoggedIn={isLoggedIn}
                    moduleId={moduleId}
                    courseId={courseId}
                />
                <ActivityNav
                    lessonToActivities={lesson.lessonToActivities}
                    courseId={courseId}
                    moduleId={moduleId}
                    lessonId={lessonId}
                    activityId={activityId}
                    isLoggedIn={isLoggedIn}
                    setIsDrawerOpen={setIsDrawerOpen}
                />
            </div>
        </>
    );
}

interface NavigationButtonsProps {
    lesson: LessonWithActivities | LessonWithActivitiesAndUserProgress;
    previousLesson: PreviousLesson;
    nextLesson: NextLesson;
    isLoggedIn: boolean;
    moduleId: string;
    courseId: string;
}

function NavigationButtons({ lesson, previousLesson, nextLesson, moduleId, courseId }: NavigationButtonsProps) {
    return (
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
    );
}

interface ActivityLinkProps {
    lessonToActivities: (LessonWithActivities | LessonWithActivitiesAndUserProgress)["lessonToActivities"];
    courseId: string;
    moduleId: string;
    lessonId: string;
    activityId: string | undefined;
    isLoggedIn: boolean;
    setIsDrawerOpen: (isOpen: boolean) => void;
}

function ActivityNav({ lessonToActivities, courseId, moduleId, lessonId, activityId, isLoggedIn, setIsDrawerOpen }: ActivityLinkProps) {
    return (
        <nav className="flex flex-col divide-y border-t border-b w-full">
            {lessonToActivities.map((lessonToActivitiesObj) => (
                <Link
                    key={lessonToActivitiesObj.activityId}
                    href={`/courses/${courseId}/${moduleId}/${lessonId}/${lessonToActivitiesObj.activityId}`}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "border-l-4 border-l-transparent py-8 rounded-none text-base whitespace-normal gap-6",
                        activityId === lessonToActivitiesObj.activityId
                            ? "border-l-primary bg-accent hover:bg-muted"
                            : "",
                        "justify-start"
                    )}
                    onClick={() => activityId === lessonToActivitiesObj.activityId && setIsDrawerOpen(false)}
                >
                    <CompletionIcon
                        isComplete={isLoggedIn ? ((activityId === lessonToActivitiesObj.activityId && lessonToActivitiesObj.activity.type === "Article") || (lessonToActivitiesObj as LessonWithActivitiesAndUserProgress["lessonToActivities"][number]).activity.userCompletion.some(userProgress => userProgress.activityId === lessonToActivitiesObj.activity.id)) : false}
                        icon={lessonToActivitiesObj.activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                        isCurrent={activityId === lessonToActivitiesObj.activityId}
                    />
                    {lessonToActivitiesObj.activity.title}
                </Link>
            ))}
        </nav>
    );
}