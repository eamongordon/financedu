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
import { type getCoursesWithModulesAndLessonsAndActivities } from "@/lib/actions";

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

function ContentSelector({ className, setOpen, courses }: { className?: string, setOpen: React.Dispatch<React.SetStateAction<boolean>>, courses: CoursesWithModulesAndLessonsAndActivities }) {
    const [selectedActivities, setSelectedActivities] = React.useState<string[]>([])

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

    const handleSubmit = () => {
        console.log(selectedActivities);
        setOpen(false);
    };

    return (
        <div className={className}>
            <Accordion type="multiple">
                {courses.map(course => (
                    <AccordionItem key={course.id} value={course.id}>
                        <Checkbox
                            checked={course.modules.every(module => module.lessons.every(lesson => lesson.activities.every(activity => selectedActivities.includes(activity.id))))}
                            onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'course', course.id)}
                        />
                        <AccordionTrigger>
                            {course.title}
                        </AccordionTrigger>
                        <AccordionContent>
                            {course.modules.map(module => (
                                <AccordionItem key={module.id} value={module.id}>
                                    <Checkbox
                                        checked={module.lessons.every(lesson => lesson.activities.every(activity => selectedActivities.includes(activity.id)))}
                                        onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'module', module.id)}
                                    />
                                    <AccordionTrigger>
                                        {module.title}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        {module.lessons.map(lesson => (
                                            <AccordionItem key={lesson.id} value={lesson.id}>
                                                <Checkbox
                                                    checked={lesson.activities.every(activity => selectedActivities.includes(activity.id))}
                                                    onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'lesson', lesson.id)}
                                                />
                                                <AccordionTrigger>
                                                    {lesson.title}
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    {lesson.activities.map(activity => (
                                                        <div key={activity.id}>
                                                            <Checkbox
                                                                checked={selectedActivities.includes(activity.id)}
                                                                onCheckedChange={(isChecked) => handleCheckboxChange(!!isChecked, 'activity', activity.id)}
                                                            />
                                                            {activity.title}
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
            <Button disabled={selectedActivities.length === 0} onClick={() => handleSubmit()}>
                ({selectedActivities.length > 0 ? "Assign " + selectedActivities.length : "Assign"})
            </Button>
        </div>
    )
}