"use client";

import * as React from "react"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { CircleHelp, FileText, Plus } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { type getCoursesWithModulesAndLessonsAndActivities } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { createAssignments } from "@/lib/actions";
import { toast } from "sonner";
import { DueDateSetter, type DueDateSetterData } from "@/components/account/duedate-setter";

type CoursesWithModulesAndLessonsAndActivities = Awaited<ReturnType<typeof getCoursesWithModulesAndLessonsAndActivities>>

export function CreateAssignments({ isNone, courses }: { isNone?: boolean, courses: CoursesWithModulesAndLessonsAndActivities }) {
    const [open, setOpen] = React.useState(false)
    const [selectedActivities, setSelectedActivities] = React.useState<string[]>([])
    const [showDueDateSetter, setShowDueDateSetter] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handleActivitySubmit = () => {
        setShowDueDateSetter(true);
    };

    const params = useParams<{ classId: string }>();
    const classId = params!.classId;
    const router = useRouter();

    const handleDueDateSubmit = async (data: DueDateSetterData) => {
        const assignments = selectedActivities.map(activityId => {
            return {
                activityId,
                startAt: data.startDate,
                dueAt: data.dueDate
            }
        })
        await createAssignments(assignments, classId);
        toast.success("Assignments created successfully.");
        resetData();
        setOpen(false);
        router.refresh();
    };

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetData();
        }
    };

    function resetData() {
        setShowDueDateSetter(false);
        setSelectedActivities([]);
    }

    function NextButton() {
        return (
            <Button disabled={selectedActivities.length === 0} onClick={() => handleActivitySubmit()}>
                {selectedActivities.length > 0 ? `Next (${selectedActivities.length} Selected)` : "Next"}
            </Button>
        );
    }

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button
                        {...!isNone ? { className: "w-full" } : {}}
                        {...isNone ? { variant: "outline" } : {}}
                    >
                        <Plus />
                        Create Assignments
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-h-[calc(100dvh-64px)]">
                    <DialogHeader className="sticky top-0 bg-background">
                        <DialogTitle>Assign Content</DialogTitle>
                        <DialogDescription>
                            {showDueDateSetter ? "Set Availability" : "Select Activities"}
                        </DialogDescription>
                    </DialogHeader>
                    {showDueDateSetter ? (
                        <DueDateSetter selectedActivities={selectedActivities} setOpen={setOpen} onSubmit={handleDueDateSubmit} />
                    ) : (
                        <>
                            <ContentSelector courses={courses} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                            <DialogFooter>
                                <NextButton />
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button
                    {...!isNone ? { className: "w-full" } : {}}
                    {...isNone ? { variant: "outline" } : {}}
                >
                    <Plus />
                    Create Assignments
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[calc(100dvh-64px)]">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Assignments</DrawerTitle>
                    <DrawerDescription>
                        {showDueDateSetter ? "Set Availability" : "Select Activities"}
                    </DrawerDescription>
                </DrawerHeader>
                {showDueDateSetter ? (
                    <DueDateSetter selectedActivities={selectedActivities} isDrawer setOpen={setOpen} onSubmit={handleDueDateSubmit} />
                ) : (
                    <>
                        <ContentSelector className="px-4" courses={courses} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                        <DrawerFooter className="pt-2">
                            <NextButton />
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </>
                )}
            </DrawerContent>
        </Drawer>
    )
}

function ContentSelector({ className, courses, selectedActivities, setSelectedActivities }: { className?: string, courses: CoursesWithModulesAndLessonsAndActivities, selectedActivities: string[], setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>> }) {
    const handleCheckboxChange = (isChecked: boolean, type: string, id: string) => {
        let scopedActivities = [];
        if (type === 'course') {
            scopedActivities = courses.find(course => course.id === id)?.modules.flatMap(module => module.lessons.flatMap(lesson => lesson.activities.map(activity => activity.id)) || []) || []
        } else if (type === 'module') {
            scopedActivities = courses.flatMap(course => course.modules.find(module => module.id === id)?.lessons.flatMap(lesson => lesson.activities.map(activity => activity.id)) || []) || []
        } else if (type === 'lesson') {
            scopedActivities = courses.flatMap(course => course.modules.flatMap(module => module.lessons.find(lesson => lesson.id === id)?.activities.map(activity => activity.id) || [])) || []
        } else {
            scopedActivities = [id]
        }
        if (isChecked) {
            setSelectedActivities([...selectedActivities].concat(scopedActivities))
        } else {
            setSelectedActivities(selectedActivities.filter(activityId => !scopedActivities.includes(activityId)))
        }
    }

    return (
        <div className={cn("flex-1 overflow-y-auto", className)}>
            <Accordion type="multiple" className="w-full">
                {courses.map(course => (
                    <AccordionItem key={course.id} value={course.id}>
                        <div className="flex flex-row items-center justify-between">
                            <AccordionTrigger className="justify-end flex-row-reverse gap-4">
                                <div className="flex flex-col justify-start text-start gap-1">
                                    <p className="block font-semibold leading-none">{course.title}</p>
                                    <p className="block text-sm leading-none">Course</p>
                                </div>
                            </AccordionTrigger>
                            <Checkbox
                                checked={course.modules.every(module => module.lessons.every(lesson => lesson.activities.every(activity => selectedActivities.includes(activity.id))))}
                                onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'course', course.id)}
                            />
                        </div>
                        <AccordionContent>
                            {course.modules.map(module => (
                                <AccordionItem key={module.id} value={module.id} className="pl-4">
                                    <div className="flex flex-row items-center justify-between">
                                        <AccordionTrigger className="justify-end flex-row-reverse gap-4">
                                            <div className="flex flex-col justify-start text-start gap-1">
                                                <p className="block font-semibold leading-none">{module.title}</p>
                                                <p className="block text-sm leading-none">Module</p>
                                            </div>
                                        </AccordionTrigger>
                                        <Checkbox
                                            checked={module.lessons.every(lesson => lesson.activities.every(activity => selectedActivities.includes(activity.id)))}
                                            onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'module', module.id)}
                                        />
                                    </div>
                                    <AccordionContent>
                                        {module.lessons.map(lesson => (
                                            <AccordionItem key={lesson.id} value={lesson.id} className="pl-4">
                                                <div className="flex flex-row items-center justify-between">
                                                    <AccordionTrigger className="justify-end flex-row-reverse gap-4">
                                                        <div className="flex flex-col justify-start text-start gap-1">
                                                            <p className="block font-semibold leading-none">{lesson.title}</p>
                                                            <p className="block text-sm leading-none">Lesson</p>
                                                        </div>
                                                    </AccordionTrigger>
                                                    <Checkbox
                                                        checked={lesson.activities.every(activity => selectedActivities.includes(activity.id))}
                                                        onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'lesson', lesson.id)}
                                                    />
                                                </div>
                                                <AccordionContent>
                                                    {lesson.activities.map(activity => (
                                                        <div key={activity.id} className="flex flex-row items-center justify-between pl-8">
                                                            <div className="flex flex-row items-center gap-4 py-2">
                                                                {activity.type === "Article" ? <FileText strokeWidth={1.5} className="text-muted-foreground" /> : <CircleHelp strokeWidth={1.5} className="text-muted-foreground" />}
                                                                <div className="flex flex-col justify-start text-start gap-1">
                                                                    <p className="block font-semibold leading-none">{activity.title}</p>
                                                                    <p className="block text-sm leading-none">{activity.type}</p>
                                                                </div>
                                                            </div>
                                                            <Checkbox
                                                                checked={selectedActivities.includes(activity.id)}
                                                                onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'activity', activity.id)}
                                                            />
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
        </div>
    )
}