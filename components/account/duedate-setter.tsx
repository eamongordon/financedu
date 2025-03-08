import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePicker12Demo } from "@/components/time-picker/time-picker-12h-demo";
import { cn } from "@/lib/utils";
import { DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { DialogFooter } from "@/components/ui/dialog";

export type DueDateSetterData = z.infer<ReturnType<typeof FormSchema>>;

const FormSchema = (isEdit: boolean) => z.object({
    startDate: z.date({
        required_error: "A start date is required.",
    }),
    dueDate: z.date({
        required_error: "A due date is required.",
    }).refine(date => {
        if (!isEdit) {
            return date >= new Date();
        }
        return true;
    }, {
        message: "Due date cannot be in the past.",
    }),
}).refine((data) => {
    return data.startDate < data.dueDate;
}, {
    message: "Due Date must be after Start Date.",
    path: ["startDate"]
});

export function DueDateSetter({
    isDrawer,
    isEdit,
    onSubmit,
    initialData
}: {
    isDrawer?: boolean,
    isEdit?: boolean,
    selectedActivities: string[],
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    onSubmit: (data: DueDateSetterData) => void,
    initialData?: { startAt: Date, dueAt: Date }
}) {
    const form = useForm<DueDateSetterData>({
        resolver: zodResolver(FormSchema(isEdit ?? true)),
        defaultValues: {
            startDate: initialData?.startAt || new Date(),
            dueDate: initialData?.dueAt || new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(23, 59, 59, 999)),
        },
        mode: "onChange"
    })

    const actionText = isEdit ? "Save Changes" : "Assign";

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                        <FormItem className={cn("flex flex-col", isDrawer && "px-4")}>
                            <FormLabel>Start Date</FormLabel>
                            <div className="flex flex-row items-center gap-4">
                                <Popover modal>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] flex-1 pl-3 text-left font-normal",
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
                    name="dueDate"
                    render={({ field }) => (
                        <FormItem className={cn("flex flex-col", isDrawer && "px-4")}>
                            <FormLabel>Due Date</FormLabel>
                            <div className="flex flex-row items-center gap-4">
                                <Popover modal>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-[240px] flex-1 pl-3 text-left font-normal",
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
                        <Button type="submit">{actionText}</Button>
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
                        <Button
                            type="submit"
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
                        >
                            {actionText}
                        </Button>
                    </DialogFooter>
                )}
            </form>
        </Form>
    );
}
