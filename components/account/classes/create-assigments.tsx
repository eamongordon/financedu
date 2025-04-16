"use client";

import { useState } from "react";
import * as React from "react";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { CircleHelp, FileText, Plus, Clipboard } from "lucide-react";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { type getCoursesWithModulesAndLessonsAndActivities } from "@/lib/fetchers";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { createAssignments } from "@/lib/actions";
import { toast } from "sonner";
import { DueDateSetter, type DueDateSetterData } from "./duedate-setter";
import { getTeacherClasses } from "@/lib/fetchers";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

type CoursesWithModulesAndLessonsAndActivities = Awaited<ReturnType<typeof getCoursesWithModulesAndLessonsAndActivities>>;
type TeacherClasses = Awaited<ReturnType<typeof getTeacherClasses>>;

type CreateAssignmentsBaseProps = {
    isNone?: boolean;
    defaultSelectedActivities?: string[];
    type: "class" | "activity" | "lesson";
};

type CreateAssignmentsClassProps = CreateAssignmentsBaseProps & {
    type: "class";
    classId: string;
    classes?: never;
    courses: CoursesWithModulesAndLessonsAndActivities;
};

type CreateAssignmentsOtherProps = CreateAssignmentsBaseProps & {
    type: "activity" | "lesson";
    classId?: never;
    classes: TeacherClasses;
    courses?: never;
};

type CreateAssignmentsProps = CreateAssignmentsClassProps | CreateAssignmentsOtherProps;

export function CreateAssignments({ isNone, courses, defaultSelectedActivities = [], type, classId, classes }: CreateAssignmentsProps) {
    const [open, setOpen] = useState(false);
    const [selectedActivities, setSelectedActivities] = useState<string[]>(defaultSelectedActivities);
    const [selectedClasses, setSelectedClasses] = useState<string[]>(type === "class" ? [classId] : []);
    const [showDueDateSetter, setShowDueDateSetter] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const handleActivitySubmit = () => {
        if (type === "class" || selectedClasses.length > 0) {
            setShowDueDateSetter(true);
        } else {
            setShowDueDateSetter(false);
        }
    };

    const handleClassSubmit = (selectedClasses: string[]) => {
        setSelectedClasses(selectedClasses);
        setShowDueDateSetter(true);
    };

    const router = useRouter();

    const handleDueDateSubmit = async (data: DueDateSetterData) => {
        const assignments = selectedClasses.flatMap(selectedClass =>
            selectedActivities.map(activityId => ({
                activityId,
                startAt: data.startDate,
                dueAt: data.dueDate,
                classId: selectedClass,
            }))
        );
        await createAssignments(assignments);
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
        setSelectedClasses(type === "class" ? [classId] : []);
    }

    function NextButton() {
        return (
            <Button disabled={selectedActivities.length === 0 || (type !== "class" && !selectedClasses.length)} onClick={handleActivitySubmit}>
                {selectedActivities.length > 0 ? `Next (${selectedActivities.length} Selected)` : "Next"}
            </Button>
        );
    }

    const description = showDueDateSetter ? "Set Availability" : type === "class" ? "Select Activities" : "Select Classes";

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogTrigger asChild>
                    <Button className={cn((!isNone && type === "class") && "w-full", type === "lesson" && "h-auto py-1 text-xs text-muted-foreground")} {...(isNone || type !== "class" ? { variant: "outline" } : {})}>
                        {type === "class" ? <Plus /> : <Clipboard strokeWidth={1.5} />}
                        {type === "class" ? "Create Assignments" : "Assign"}
                    </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-h-[calc(100dvh-64px)]">
                    <DialogHeader className="sticky top-0 bg-background">
                        <DialogTitle>Assign Content</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    {(showDueDateSetter && selectedClasses.length > 0) ? (
                        <DueDateSetter selectedActivities={selectedActivities} setOpen={setOpen} onSubmit={handleDueDateSubmit} />
                    ) : (
                        <>
                            {type === "class" && courses && (
                                <>
                                    <ContentSelector courses={courses} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                                    <DialogFooter>
                                        {type === "class" && (
                                            <NextButton />
                                        )}
                                    </DialogFooter>
                                </>
                            )}
                            {type !== "class" && !selectedClasses.length && (
                                <ClassSelector teacherClasses={classes} onSubmit={handleClassSubmit} />
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={handleOpenChange}>
            <DrawerTrigger asChild>
                <Button className={cn(!isNone && "w-full", type === "lesson" && "h-auto py-1 text-xs text-muted-foreground")} {...(isNone || type !== "class" ? { variant: "outline" } : {})}>
                    {type === "class" ? <Plus /> : <Clipboard strokeWidth={1.5} />}
                    {type === "class" ? "Create Assignments" : "Assign"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className="max-h-[calc(100dvh-64px)]">
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Assignments</DrawerTitle>
                    <DrawerDescription>
                        {description}
                    </DrawerDescription>
                </DrawerHeader>
                {showDueDateSetter ? (
                    <DueDateSetter selectedActivities={selectedActivities} isDrawer setOpen={setOpen} onSubmit={handleDueDateSubmit} />
                ) : type === "class" ? (
                    <>
                        <ContentSelector className="px-4" courses={courses} selectedActivities={selectedActivities} setSelectedActivities={setSelectedActivities} />
                        <DrawerFooter className="pt-2">
                            {type === "class" && (
                                <NextButton />
                            )}
                            <DrawerClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </>
                ) : (
                    <ClassSelector teacherClasses={classes} onSubmit={handleClassSubmit} isDrawer />
                )}
            </DrawerContent>
        </Drawer>
    );
}

function ContentSelector({ className, courses, selectedActivities, setSelectedActivities }: { className?: string, courses: CoursesWithModulesAndLessonsAndActivities, selectedActivities: string[], setSelectedActivities: React.Dispatch<React.SetStateAction<string[]>> }) {
    const handleCheckboxChange = (isChecked: boolean, type: string, id: string) => {
        let scopedActivities = [];
        if (type === 'course') {
            scopedActivities = courses.find(course => course.id === id)?.modules.flatMap(module => module.lessons.flatMap(lesson => lesson.activities.map(activity => activity.id)) || []) || [];
        } else if (type === 'module') {
            scopedActivities = courses.flatMap(course => course.modules.find(module => module.id === id)?.lessons.flatMap(lesson => lesson.activities.map(activity => activity.id)) || []) || [];
        } else if (type === 'lesson') {
            scopedActivities = courses.flatMap(course => course.modules.flatMap(module => module.lessons.find(lesson => lesson.id === id)?.activities.map(activity => activity.id) || [])) || [];
        } else {
            scopedActivities = [id];
        }
        if (isChecked) {
            setSelectedActivities([...selectedActivities].concat(scopedActivities));
        } else {
            setSelectedActivities(selectedActivities.filter(activityId => !scopedActivities.includes(activityId)));
        }
    };

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
    );
}

const ClassSchema = z.object({
    selectedClasses: z.array(z.string()).nonempty("Please select at least one class.")
});

function ClassSelector({ teacherClasses, onSubmit, isDrawer }: { teacherClasses: TeacherClasses, onSubmit: (selectedClasses: string[]) => void, isDrawer?: boolean }) {
    const form = useForm({
        resolver: zodResolver(ClassSchema),
        defaultValues: {
            selectedClasses: []
        },
        mode: "onChange"
    });

    const handleSubmit = (data: { selectedClasses: string[] }) => {
        onSubmit(data.selectedClasses);
    };

    const SubmitButton = () => {
        const selectedClasses = form.watch("selectedClasses");
        return (
            <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
                {selectedClasses.length > 0 ? `Next (${selectedClasses.length} Selected)` : "Next"}
            </Button>
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="selectedClasses"
                    render={({ field }) => (
                        <FormItem className={cn(isDrawer && "px-4")}>
                            <div className="flex flex-col gap-4">
                                {teacherClasses.map(teacherClass => (
                                    <FormControl key={teacherClass.id}>
                                        <div className="flex gap-2 items-center space-x-4">
                                            <Checkbox
                                                checked={field.value.includes(teacherClass.id)}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...field.value, teacherClass.id])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== teacherClass.id
                                                            )
                                                        )
                                                }}
                                                id={teacherClass.id}
                                            />
                                            <FormLabel htmlFor={teacherClass.id} className="space-y-1">
                                                <h4>{teacherClass.name}</h4>
                                                <p className="text-muted-foreground text-sm">{teacherClass.classStudents.length} Student{teacherClass.classStudents.length !== 1 && "s"}</p>
                                            </FormLabel>
                                        </div>
                                    </FormControl>
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {isDrawer ?
                    (
                        <DrawerFooter className="pt-2">
                            <SubmitButton />
                            <DrawerClose asChild>
                                <Button
                                    variant="outline"
                                    disabled={!form.formState.isValid || form.formState.isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </DrawerClose>
                        </DrawerFooter>
                    ) : (
                        <DialogFooter>
                            <SubmitButton />
                        </DialogFooter>
                    )}
            </form>
        </Form>
    );
}