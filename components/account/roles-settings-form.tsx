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
import { editUser } from "@/lib/actions"
import { useRouter } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Roles } from "@/lib/schema";
import { GraduationCap, Apple } from "lucide-react";

const rolesFormSchema = z.object({
    roles: z.custom<Roles>((value) => Array.isArray(value) && value.every((role) => ["learner", "parent", "teacher"].includes(role)))
})

export type RolesFormValues = z.infer<typeof rolesFormSchema>

interface RolesFormProps {
    defaultValues: RolesFormValues;
}

export function RolesSettingsForm({ defaultValues }: RolesFormProps) {
    return (
        <SessionProvider>
            <RolesSettingsFormInner defaultValues={defaultValues} />
        </SessionProvider>
    )
}

export function RolesSettingsFormInner({ defaultValues }: RolesFormProps) {
    const router = useRouter();
    const { update } = useSession();

    const form = useForm<RolesFormValues>({
        resolver: zodResolver(rolesFormSchema),
        defaultValues,
    })

    async function onSubmit(data: RolesFormValues) {
        try {
            await editUser({ roles: data.roles });
            await update({ roles: data.roles });
            router.refresh();
            toast.success("Roles updated!");
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormItem>
                    <FormLabel>Roles</FormLabel>
                    <div className="flex flex-col space-y-4">
                        <FormField
                            control={form.control}
                            name="roles"
                            render={() => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-4">
                                            <Checkbox
                                                checked={true}
                                                disabled
                                            />
                                            <GraduationCap size={24} />
                                            <div>
                                                <FormLabel>Learner</FormLabel>
                                                <p className="text-muted-foreground text-sm">Access all learning materials.</p>
                                            </div>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-4">
                                            <Checkbox
                                                checked={field.value.includes("parent")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        field.onChange([...field.value, "parent"]);
                                                    } else {
                                                        field.onChange(field.value.filter((value) => value !== "parent"));
                                                    }
                                                }}
                                            />
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M10.102 17.102A4 4 0 0 0 7.291 19.5" />
                                                <path d="M13.898 17.102A4 4 0 0 1 16.71 19.5" />
                                                <path d="M14.5 9.289A4 4 0 0 0 12 13a4 4 0 0 0-2.5-3.706" />
                                                <path d="M19.5 9.297a4 4 0 0 1 2.452 4.318" />
                                                <path d="M4.5 9.288a4 4 0 0 0-2.452 4.327" />
                                                <circle cx="12" cy="15.5" r="2.5" />
                                                <circle cx="17" cy="7" r="3" />
                                                <circle cx="7" cy="7" r="3" />
                                            </svg>
                                            <div>
                                                <FormLabel>Parent</FormLabel>
                                                <p className="text-muted-foreground text-sm">Monitor your child&apos;s progress.</p>
                                            </div>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="roles"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-4">
                                            <Checkbox
                                                checked={field.value.includes("teacher")}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        field.onChange([...field.value, "teacher"]);
                                                    } else {
                                                        field.onChange(field.value.filter((value) => value !== "teacher"));
                                                    }
                                                }}
                                            />
                                            <Apple size={24} />
                                            <div>
                                                <FormLabel>Teacher</FormLabel>
                                                <p className="text-muted-foreground text-sm">Manage and create learning materials.</p>
                                            </div>
                                        </div>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormMessage />
                </FormItem>
                <Button isLoading={form.formState.isSubmitting} disabled={!form.formState.isDirty} type="submit">Update Roles</Button>
            </form>
        </Form>
    )
}