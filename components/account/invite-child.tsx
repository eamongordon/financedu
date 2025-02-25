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
import { createParentChildInvite } from "@/lib/actions";
import { toast } from "sonner";

export function InviteChild() {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mt-6">
                        <Plus />
                        Add Child
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Invite Child</DialogTitle>
                        <DialogDescription>
                            Invite a child to your account by entering their email address. If they do not have an account, they will be prompted to create one.
                        </DialogDescription>
                    </DialogHeader>
                    <ProfileForm />
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
                    <DrawerTitle>Invite Child</DrawerTitle>
                    <DrawerDescription>
                        Invite a child to your account by entering their email address. If they do not have an account, they will be prompted to create one.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4" />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

const inviteChildFormSchema = z.object({
    email: z.string().email()
});

function ProfileForm({ className }: React.ComponentProps<"form">) {
    const inviteChildForm = useForm<z.infer<typeof inviteChildFormSchema>>({
        resolver: zodResolver(inviteChildFormSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof inviteChildFormSchema>) {
        await createParentChildInvite(values.email);
        toast.success("Child invited successfully");
    };

    return (
        <Form {...inviteChildForm}>
            <form onSubmit={inviteChildForm.handleSubmit(onSubmit)} className={cn("grid items-start gap-4", className)}>
                <FormField
                    control={inviteChildForm.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="mysmartchild@example.com" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" isLoading={inviteChildForm.formState.isSubmitting}>Submit</Button>
            </form>
        </Form>
    )
}
