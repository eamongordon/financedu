"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "sonner";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Checkbox } from "../ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const categories = [
    { label: "Courses", value: "Course" },
    { label: "Modules", value: "Module" },
    { label: "Lessons", value: "Lesson" },
    { label: "Activities", value: "Activity" }
];

const formSchema = z.object({
    categories: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "Please select at least one category.",
    }),
})

export type FormValues = z.infer<typeof formSchema>

interface ProfileFormProps {
    defaultCategories: FormValues["categories"];
}

export function CategoryFilter({ defaultCategories }: ProfileFormProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categories: defaultCategories ?? [],
        },
        mode: "onTouched"
    });

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    async function onChange(data: FormValues) {
        try {
            form.reset(data);
            const current = new URLSearchParams(Array.from(searchParams!.entries()));

            if (data.categories) {
                current.set("categories", data.categories.join(","));
            } else {
                current.delete("categories");
            }

            const search = current.toString();
            const queryParam = search ? `?${search}` : "";
            router.push(`${pathname}${queryParam}`);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong.");
        }
    }

    return (
        <Form {...form}>
            <form onChange={form.handleSubmit(onChange)} className="space-y-4 md:pt-2">
                <FormField
                    control={form.control}
                    name="categories"
                    render={() => (
                        <FormItem>
                            <FormLabel className="font-semibold text-base hidden md:inline">Category</FormLabel>
                            <div className="flex flex-row flex-wrap gap-4 md:flex-col md:gap-2">
                                {categories.map((category) => (
                                    <FormField
                                        key={category.value}
                                        control={form.control}
                                        name="categories"
                                        render={({ field }) => {
                                            return (
                                                <FormItem
                                                    className="flex flex-row items-center space-x-3 space-y-0"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value?.includes(category.value)}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, category.value])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== category.value
                                                                        )
                                                                    )
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="text-base font-normal">
                                                        {category.label}
                                                    </FormLabel>
                                                </FormItem>
                                            )
                                        }}
                                    />
                                ))}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}