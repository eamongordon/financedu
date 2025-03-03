"use client";

import * as React from "react"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { createAssignments, type getCoursesWithModulesAndLessonsAndActivities } from "@/lib/actions";
import { useParams, useRouter } from "next/navigation";
//import { createAssignments } from "@/lib/actions/assignments";

type CoursesWithModulesAndLessonsAndActivities = Awaited<ReturnType<typeof getCoursesWithModulesAndLessonsAndActivities>>

export function CreateAssignments({ isNoChildren, courses }: { isNoChildren?: boolean, courses: CoursesWithModulesAndLessonsAndActivities }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-6" {...isNoChildren ? { variant: "outline" } : {}}>
                        <Plus />
                        Create Assignments
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[calc(100dvh-100px)] overflow-auto">
                    <DialogHeader>
                        <DialogTitle>Assign Content</DialogTitle>
                        <DialogDescription>
                            Assign Lessons
                        </DialogDescription>
                    </DialogHeader>
                    <ContentSelector setOpen={setOpen} courses={courses} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="mt-6">
                    <Plus />
                    Create Assignments
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[calc(100dvh-100px)] overflow-auto">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Assign Content</DrawerTitle>
                    <DrawerDescription>
                        Assign lessons.
                    </DrawerDescription>
                </DrawerHeader>
                <ContentSelector className="px-4" setOpen={setOpen} courses={courses} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

type SelectedActivity = {
    courseId: string;
    moduleId: string;
    lessonId: string;
    activityId: string;
};

function ContentSelector({ className, setOpen, courses }: { className?: string, setOpen: React.Dispatch<React.SetStateAction<boolean>>, courses: CoursesWithModulesAndLessonsAndActivities }) {
    const [selectedActivities, setSelectedActivities] = React.useState<SelectedActivity[]>([])
    const router = useRouter();
    const params = useParams<{ classId: string }>();
    const classId = params!.classId;
    const handleCheckboxChange = (isChecked: boolean, type: string, id: string, courseId?: string, moduleId?: string, lessonId?: string) => {
        let scopedActivities: SelectedActivity[] = [];
        if (type === 'course') {
            const course = courses.find(course => course.id === id);
            if (course) {
                scopedActivities = course.modules.flatMap(mod => mod.lessons.flatMap(lesson => lesson.lessonToActivities.map(lessonToActivity => ({
                    courseId: id,
                    moduleId: mod.id,
                    lessonId: lesson.id,
                    activityId: lessonToActivity.activity.id
                }))));
            }
        } else if (type === 'module') {
            const course = courses.find(course => course.id === courseId);
            const mod = course?.modules.find(mod => mod.id === id);
            if (mod) {
                scopedActivities = mod.lessons.flatMap(lesson => lesson.lessonToActivities.map(lessonToActivity => ({
                    courseId: courseId!,
                    moduleId: id,
                    lessonId: lesson.id,
                    activityId: lessonToActivity.activity.id
                })));
            }
        } else if (type === 'lesson') {
            const course = courses.find(course => course.id === courseId);
            const mod = course?.modules.find(mod => mod.id === moduleId);
            const lesson = mod?.lessons.find(lesson => lesson.id === id);
            if (lesson) {
                scopedActivities = lesson.lessonToActivities.map(lessonToActivity => ({
                    courseId: courseId!,
                    moduleId: moduleId!,
                    lessonId: id,
                    activityId: lessonToActivity.activity.id
                }));
            }
        } else {
            const course = courses.find(course => course.id === courseId);
            const mod = course?.modules.find(mod => mod.id === moduleId);
            const lesson = mod?.lessons.find(lesson => lesson.id === lessonId);
            const lessonToActivity = lesson?.lessonToActivities.find(lessonToActivity => lessonToActivity.activity.id === id);
            if (lessonToActivity) {
                scopedActivities = [{
                    courseId: courseId!,
                    moduleId: moduleId!,
                    lessonId: lessonId!,
                    activityId: id
                }];
            }
        }
        if (isChecked) {
            setSelectedActivities([...selectedActivities, ...scopedActivities])
        } else {
            setSelectedActivities(selectedActivities.filter(activity => !scopedActivities.some(scopedActivity => scopedActivity.activityId === activity.activityId)))
        }
    }

    const isCourseChecked = (courseId: string) => {
        return courses.find(course => course.id === courseId)?.modules.every(mod => mod.lessons.every(lesson => lesson.lessonToActivities.every(lessonToActivity => selectedActivities.some(activity =>
            activity.activityId === lessonToActivity.activity.id &&
            activity.lessonId === lesson.id &&
            activity.moduleId === mod.id &&
            activity.courseId === courseId
        )))) || false;
    }

    const isModuleChecked = (courseId: string, moduleId: string) => {
        return courses.find(course => course.id === courseId)?.modules.find(mod => mod.id === moduleId)?.lessons.every(lesson => lesson.lessonToActivities.every(lessonToActivity => selectedActivities.some(activity =>
            activity.activityId === lessonToActivity.activity.id &&
            activity.lessonId === lesson.id &&
            activity.moduleId === moduleId &&
            activity.courseId === courseId
        ))) || false;
    }

    const isLessonChecked = (courseId: string, moduleId: string, lessonId: string) => {
        return courses.find(course => course.id === courseId)?.modules.find(mod => mod.id === moduleId)?.lessons.find(lesson => lesson.id === lessonId)?.lessonToActivities.every(lessonToActivity => selectedActivities.some(activity =>
            activity.activityId === lessonToActivity.activity.id &&
            activity.lessonId === lessonId &&
            activity.moduleId === moduleId &&
            activity.courseId === courseId
        )) || false;
    }

    const handleSubmit = async () => {
        const activities = selectedActivities.map(activity => ({
            courseId: activity.courseId,
            moduleId: activity.moduleId,
            lessonId: activity.lessonId,
            activityId: activity.activityId
        }));
        await createAssignments({
            classId,
            activities
        });
        router.refresh();
        setOpen(false);
    };

    return (
        <div className={className}>
            <Accordion type="multiple">
                {courses.map(course => (
                    <AccordionItem key={course.id} value={course.id}>
                        <Checkbox
                            checked={isCourseChecked(course.id)}
                            onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'course', course.id)}
                        />
                        <AccordionTrigger>
                            {course.title}
                        </AccordionTrigger>
                        <AccordionContent>
                            {course.modules.map(mod => (
                                <AccordionItem key={mod.id} value={mod.id}>
                                    <Checkbox
                                        checked={isModuleChecked(course.id, mod.id)}
                                        onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'module', mod.id, course.id)}
                                    />
                                    <AccordionTrigger>
                                        {mod.title}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {mod.lessons.map(lesson => (
                                            <AccordionItem key={lesson.id} value={lesson.id}>
                                                <Checkbox
                                                    checked={isLessonChecked(course.id, mod.id, lesson.id)}
                                                    onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'lesson', lesson.id, course.id, mod.id)}
                                                />
                                                <AccordionTrigger>
                                                    {lesson.title}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {lesson.lessonToActivities.map(lessonToActivity => (
                                                        <div key={lessonToActivity.activity.id}>
                                                            <Checkbox
                                                                checked={selectedActivities.some(activity =>
                                                                    activity.activityId === lessonToActivity.activity.id &&
                                                                    activity.lessonId === lesson.id &&
                                                                    activity.moduleId === mod.id &&
                                                                    activity.courseId === course.id
                                                                )}
                                                                onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'activity', lessonToActivity.activity.id, course.id, mod.id, lesson.id)}
                                                            />
                                                            {lessonToActivity.activity.title}
                                                        </div>
                                                    ))}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
            <Button disabled={selectedActivities.length === 0} onClick={handleSubmit}>
                {selectedActivities.length > 0 ? `Assign ${selectedActivities.length}` : "Assign"}
            </Button>
        </div>
    )
}
