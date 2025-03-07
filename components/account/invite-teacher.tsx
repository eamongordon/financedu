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
import { createClassTeacherInvite } from "@/lib/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function InviteTeacher({ classId }: { classId: string }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button>
                        <Plus />
                        Invite Teacher
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Invite Teacher</DialogTitle>
                        <DialogDescription>
                            Invite a teacher to join your class by entering their email address. If they do not have an account, they will be prompted to create one.
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm setOpen={setOpen} classId={classId} />
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button>
                    <Plus />
                    Invite Teacher
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Invite Teacher</DrawerTitle>
                    <DrawerDescription>
                        Invite a teacher to join your class by entering their email address. If they do not have an account, they will be prompted to create one.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" setOpen={setOpen} classId={classId} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const inviteTeacherFormSchema = z.object({
    email: z.string().email()
});

function ProfileForm({ className, setOpen, classId }: React.ComponentProps<"form"> & { setOpen: React.Dispatch<React.SetStateAction<boolean>>, classId: string }) {
    const inviteTeacherForm = useForm<z.infer<typeof inviteTeacherFormSchema>>({
        resolver: zodResolver(inviteTeacherFormSchema),
        defaultValues: {
            email: "",
        },
    });

    const router = useRouter();

    async function onSubmit(values: z.infer<typeof inviteTeacherFormSchema>) {
        await createClassTeacherInvite(classId, values.email);
        toast.success("Teacher invited successfully");
        setOpen(false);
        router.refresh();
    };

    return (
        <Form {...inviteTeacherForm}>
            <form onSubmit={inviteTeacherForm.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <FormField
                    control={inviteTeacherForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="awesometeacher@example.com" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" isLoading={inviteTeacherForm.formState.isSubmitting}>Submit</Button>
            </form>
        </Form>
    )
}
