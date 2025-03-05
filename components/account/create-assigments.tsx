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
import { Plus } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { type getCoursesWithModulesAndLessonsAndActivities } from "@/lib/actions";
import { cn } from "@/lib/utils";

type CoursesWithModulesAndLessonsAndActivities = Awaited<ReturnType<typeof getCoursesWithModulesAndLessonsAndActivities>>

export function CreateAssignments({ isNoChildren, courses }: { isNoChildren?: boolean, courses: CoursesWithModulesAndLessonsAndActivities }) {
    const [open, setOpen] = React.useState(false)
    const [selectedActivities, setSelectedActivities] = React.useState<string[]>([])
    const [dueDate, setDueDate] = React.useState<string>("");
    const [showDueDateSetter, setShowDueDateSetter] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handleActivitySubmit = () => {
        setShowDueDateSetter(true);
    };

    const handleDueDateSubmit = () => {
        const dueDates = selectedActivities.reduce((acc, activityId) => {
            acc[activityId] = dueDate;
            return acc;
        }, {} as Record<string, string>);
        console.log(dueDates);
        setOpen(false);
        setShowDueDateSetter(false);
    };

    const handleDueDateCancel = () => {
        setShowDueDateSetter(false);
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-6" {...isNoChildren ? { variant: "outline" } : {}}>
                        <Plus />
                        Create Assignments
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-h-[calc(100dvh-64px)]">
                    <DialogHeader className="sticky top-0 bg-background">
                        <DialogTitle>Assign Content</DialogTitle>
                        <DialogDescription>
                            {showDueDateSetter ? "Set Due Date" : "Select Activities"}
                        </DialogDescription>
                    </DialogHeader>
                    {showDueDateSetter ? (
                        <>
                            <DueDateSetter dueDate={dueDate} setDueDate={setDueDate} />
                            <DialogFooter>
                                <Button disabled={!dueDate} onClick={() => handleDueDateSubmit()}>
                                    Assign
                                </Button>
                                <Button variant="outline" onClick={handleDueDateCancel}>Cancel</Button>
                            </DialogFooter>
                        </>
                    ) : (
                        <>
                            <ContentSelector courses={courses} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                            <DialogFooter>
                                <Button disabled={selectedActivities.length === 0} onClick={() => handleActivitySubmit()}>
                                    ({selectedActivities.length > 0 ? "Next" : "Next"})
                                </Button>
                            </DialogFooter>
                        </>
                    )}
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
            <DrawerContent className="max-h-[calc(100dvh-64px)]">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Assign Content</DrawerTitle>
                    <DrawerDescription>
                        {showDueDateSetter ? "Set Due Date" : "Select Activities"}
                    </DrawerDescription>
                </DrawerHeader>
                {showDueDateSetter ? (
                    <>
                        <DueDateSetter dueDate={dueDate} setDueDate={setDueDate} />
                        <DrawerFooter className="pt-2">
                            <Button disabled={!dueDate} onClick={() => handleDueDateSubmit()}>
                                Assign
                            </Button>
                            <DrawerClose asChild>
                                <Button variant="outline" onClick={handleDueDateCancel}>Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </>
                ) : (
                    <>
                        <ContentSelector className="px-4" courses={courses} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                        <DrawerFooter className="pt-2">
                            <Button disabled={selectedActivities.length === 0} onClick={() => handleActivitySubmit()}>
                                ({selectedActivities.length > 0 ? "Next" : "Next"})
                            </Button>
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
                                {course.title}
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
                                            {module.title}
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
                                                        {lesson.title}
                                                    </AccordionTrigger>
                                                    <Checkbox
                                                        checked={lesson.activities.every(activity => selectedActivities.includes(activity.id))}
                                                        onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'lesson', lesson.id)}
                                                    />
                                                </div>
                                                <AccordionContent>
                                                    {lesson.activities.map(activity => (
                                                        <div key={activity.id} className="flex flex-row items-center justify-between pl-4">
                                                            {activity.title}
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

function DueDateSetter({ dueDate, setDueDate }: { dueDate: string, setDueDate: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <div className="flex flex-col p-4">
            <label className="mb-2">Set Due Date</label>
            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border p-1 w-full"
            />
        </div>
    );
}