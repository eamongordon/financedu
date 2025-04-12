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
import { updateClass } from "@/lib/actions"
import { useParams, useRouter } from "next/navigation";

const profileFormSchema = z.object({
    name: z.string()
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>

interface ProfileFormProps {
    defaultValues: ProfileFormValues;
}

export function ClassSettingsForm({ defaultValues }: ProfileFormProps) {
    const router = useRouter();
    const params = useParams<{ classId: string }>();
    const classId = params!.classId;

    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    });

    async function onSubmit(data: ProfileFormValues) {
        try {
            await updateClass(classId, data)
            router.refresh();
            form.reset(data);
            toast.success("Class Updated!");
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
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Class Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button isLoading={form.formState.isSubmitting} disabled={!form.formState.isDirty} type="submit">Update Class Name</Button>
            </form>
        </Form>
    )
}