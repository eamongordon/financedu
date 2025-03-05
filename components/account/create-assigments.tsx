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

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TimePicker12Demo } from "@/components/time-picker/time-picker-12h-demo";
import { useParams, useRouter } from "next/navigation";
import { createAssignments } from "@/lib/actions";
import { toast } from "sonner";

type CoursesWithModulesAndLessonsAndActivities = Awaited<ReturnType<typeof getCoursesWithModulesAndLessonsAndActivities>>

export function CreateAssignments({ isNoChildren, courses }: { isNoChildren?: boolean, courses: CoursesWithModulesAndLessonsAndActivities }) {
    const [open, setOpen] = React.useState(false)
    const [selectedActivities, setSelectedActivities] = React.useState<string[]>([])
    const [showDueDateSetter, setShowDueDateSetter] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)")

    const handleActivitySubmit = () => {
        setShowDueDateSetter(true);
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
                            {showDueDateSetter ? "Set Availability" : "Select Activities"}
                        </DialogDescription>
                    </DialogHeader>
                    {showDueDateSetter ? (
                        <DueDateSetter selectedActivities={selectedActivities} setOpen={setOpen} />
                    ) : (
                        <>
                            <ContentSelector courses={courses} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                            <DialogFooter>
                                <Button disabled={selectedActivities.length === 0} onClick={() => handleActivitySubmit()}>
                                    {selectedActivities.length > 0 ? `Next (${selectedActivities.length} Selected)` : "Next"}
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
                    <DrawerTitle>Create Assignments</DrawerTitle>
                    <DrawerDescription>
                        {showDueDateSetter ? "Set Availability" : "Select Activities"}
                    </DrawerDescription>
                </DrawerHeader>
                {showDueDateSetter ? (
                    <DueDateSetter selectedActivities={selectedActivities} isDrawer setOpen={setOpen} />
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

const FormSchema = z.object({
    startDate: z.date({
        required_error: "A start date is required.",
    }).refine(date => date >= new Date(), {
        message: "Start date cannot be in the past.",
    }),
    endDate: z.date({
        required_error: "A due date is required.",
    })
}).refine((data) => {
    return data.startDate < data.endDate;
}, {
    message: "Due Date must be after Start Date.",
    path: ["startDate"]
});

function DueDateSetter({ isDrawer, selectedActivities, setOpen }: { isDrawer?: boolean, selectedActivities: string[], setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            startDate: new Date(),
            endDate: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(23, 59, 59, 999)),
        }
    })

    const params = useParams<{ classId: string }>();
    const classId = params!.classId;
    const router = useRouter();

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        console.log(selectedActivities);
        const activities = selectedActivities.map(activityId => activityId)
        await createAssignments(activities, classId);
        toast.success("Assignments created successfully.");
        setOpen(false);
        router.refresh();
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Start Date</FormLabel>
                            <div className="flex flex-row items-center gap-4">
                                <Popover modal>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <TimePicker12Demo
                                    setDate={field.onChange}
                                    date={field.value}
                                />
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Due Date</FormLabel>
                            <div className="flex flex-row items-center gap-4">
                                <Popover modal>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < form.getValues("startDate")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                    <TimePicker12Demo
                                        setDate={field.onChange}
                                        date={field.value}
                                    />
                                </Popover>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isDrawer ? (
                    <DrawerFooter className="pt-2">
                        <Button type="submit">Assign</Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                ) : (
                    <DialogFooter>
                        <Button type="submit">Assign</Button>
                    </DialogFooter>
                )}
            </form>
        </Form>
    );
}