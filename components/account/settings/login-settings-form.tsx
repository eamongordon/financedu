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
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { updateUserPassword } from "@/lib/actions";

const emailFormSchema = z.object({
    email: z.string().email(),
});

const passwordFormSchema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
});

type EmailFormValues = z.infer<typeof emailFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

interface LoginFormProps {
    defaultValues: {
        email: string;
        password: string;
    };
}

export function LoginSettingsForm({ defaultValues }: LoginFormProps) {
    return (
        <LoginSettingsFormInner defaultValues={defaultValues} />
    )
}

export function LoginSettingsFormInner({ defaultValues }: LoginFormProps) {
    const router = useRouter();

    // Email form
    const emailForm = useForm<EmailFormValues>({
        resolver: zodResolver(emailFormSchema),
        defaultValues: { email: defaultValues.email },
    });

    // Password form
    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: { password: "" },
    });

    async function onEmailSubmit(data: EmailFormValues) {
        try {
            await authClient.changeEmail({ newEmail: data.email });
            router.refresh();
            emailForm.reset(data);
            toast.success("Email updated!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong updating email.");
        }
    }

    async function onPasswordSubmit(data: PasswordFormValues) {
        try {
            await updateUserPassword(data.password);
            router.refresh();
            passwordForm.reset({ password: "" });
            toast.success("Password updated!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong updating password.");
        }
    }

    return (
        <div className="space-y-12">
            {/* Email Form */}
            <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-8">
                    <FormField
                        control={emailForm.control}
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
                    <Button isLoading={emailForm.formState.isSubmitting} disabled={!emailForm.formState.isDirty} type="submit">
                        Update Email
                    </Button>
                </form>
            </Form>

            {/* Password Form */}
            <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-8">
                    <FormField
                        control={passwordForm.control}
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
                    <Button isLoading={passwordForm.formState.isSubmitting} disabled={!passwordForm.formState.isDirty} type="submit">
                        Update Password
                    </Button>
                </form>
            </Form>
        </div>
    )
}