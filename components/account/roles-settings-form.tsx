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
import { Label } from "@/components/ui/label";
import { Roles } from "@/lib/schema";

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
                <FormField
                    control={form.control}
                    name="roles"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Roles</FormLabel>
                            <div className="flex flex-col space-y-2">
                                <FormControl>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            checked={true}
                                            disabled
                                        />
                                        <Label>Learner</Label>
                                    </div>
                                </FormControl>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
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
                                        <Label>Parent</Label>
                                    </div>
                                </FormControl>
                                <FormControl>
                                    <div className="flex items-center space-x-2">
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
                                        <Label>Teacher</Label>
                                    </div>
                                </FormControl>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting} disabled={!form.formState.isDirty} type="submit">Update Roles</Button>
            </form>
        </Form>
    )
}