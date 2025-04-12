"use client";

import * as React from "react"

import { cn } from "@/lib/utils"
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
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { createClass } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function CreateClass({ isNoClasses }: { isNoClasses?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-6" {...isNoClasses ? { variant: "outline" } : {}}>
                        <Plus />
                        Create Class
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Class</DialogTitle>
                        <DialogDescription>
                            Give your class a name. You can add students later.
                        </DialogDescription>
                    </DialogHeader>
                    <ClassForm setOpen={setOpen} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button className="mt-6">
                    <Plus />
                    Add Child
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Create Class</DrawerTitle>
                    <DrawerDescription>
                        Give your class a name. You can add students later.
                    </DrawerDescription>
                </DrawerHeader>
                <ClassForm className="px-4" setOpen={setOpen} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const createClassFormSchema = z.object({
    name: z.string()
});

function ClassForm({ className, setOpen }: React.ComponentProps<"form"> & { setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const createClassForm = useForm<z.infer<typeof createClassFormSchema>>({
        resolver: zodResolver(createClassFormSchema),
        defaultValues: {
            name: "",
        },
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof createClassFormSchema>) {
        await createClass(values.name);
        toast.success("Child invited successfully");
        setOpen(false);
        router.refresh();
    };

    return (
        <Form {...createClassForm}>
            <form onSubmit={createClassForm.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <FormField
                    control={createClassForm.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="My Awesome Class" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" isLoading={createClassForm.formState.isSubmitting}>Submit</Button>
            </form>
        </Form>
    )
}
