"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { editUser } from "@/lib/actions"
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";

const loginFormSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 8 characters long"),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>

interface LoginFormProps {
    defaultValues: LoginFormValues;
}

export function LoginSettingsForm({ defaultValues }: LoginFormProps) {
    return (
        <SessionProvider>
            <LoginSettingsFormInner defaultValues={defaultValues} />
        </SessionProvider>
    )
}

export function LoginSettingsFormInner({ defaultValues }: LoginFormProps) {
    const router = useRouter();
    const { update } = useSession();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginFormSchema),
        defaultValues,
    })

    async function onSubmit(data: LoginFormValues) {
        try {
            await editUser(data);
            await update(data);
            router.refresh();
            toast.success("Login information updated!");
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
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Email" {...field} />
                            </FormControl>
                            <FormDescription>This email is used for both login and contact.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Reset Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Password" {...field} />
                            </FormControl>
                            <FormDescription>Your new password must be at least 8 characters long.</FormDescription>                            
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting} disabled={!form.formState.isDirty} type="submit">Update Login Info</Button>
            </form>
        </Form>
    )
}