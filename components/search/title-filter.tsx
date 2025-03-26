"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Search } from "lucide-react";

import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { useEffect } from "react";

const formSchema = z.object({
    title: z.string(),
})

export type FormValues = z.infer<typeof formSchema>

interface FormProps {
    defaultTitle?: string;
    isModal?: boolean;
    onSubmit?: (data: FormValues) => void;
}

export function TitleFilter({ defaultTitle, isModal, onSubmit }: FormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: defaultTitle ?? "",
        },
        mode: "onTouched"
    });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!defaultTitle && !isModal) {
            // clear the form when filters are reset
            form.reset({
                title: defaultTitle
            });
        }
    }, [form, defaultTitle, isModal]);

    async function onFormSubmit(data: FormValues) {
        try {
            form.reset(data);
            if (onSubmit) {
                onSubmit(data);
            }
            if (isModal) {
                router.push(`/search?q=${data.title}`);
            } else {
                const current = new URLSearchParams(Array.from(searchParams!.entries()));
                if (data.title) {
                    current.set("q", data.title);
                } else {
                    current.delete("q");
                }

                const search = current.toString();
                const queryParam = search ? `?${search}` : "";
                router.push(`${pathname}${queryParam}`);
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)} className="flex flex-row gap-2">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    placeholder="Search Content..."
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="sm:grow-[0.2]">
                    <Search />
                    Search
                </Button>
            </form>
        </Form>
    )
}