"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { authClient, useSession } from "@/lib/auth-client";

const profileFormSchema = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
    defaultValues: ProfileFormValues;
}

export function ProfileForm({ defaultValues }: ProfileFormProps) {
    return (
        <ProfileFormInner defaultValues={defaultValues} />
    )
}

export function ProfileFormInner({ defaultValues }: ProfileFormProps) {
    const { refetch } = useSession();

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    });

    async function onSubmit(data: ProfileFormValues) {
        try {
            await authClient.updateUser(data);
            await refetch();
            form.reset(data);
            toast.success("Profile updated!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                                <Input placeholder="First Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Last Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting} disabled={!form.formState.isDirty} type="submit">Update Profile</Button>
            </form>
        </Form>
    )
}