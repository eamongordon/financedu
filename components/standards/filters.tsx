"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect, useCallback } from 'react';
import { X, Search, FileText, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { getActivityDisplay, getLessonDisplay } from "@/lib/fetchers";

const states = [
    "National",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
];

const categories = [
    "Credit",
    "Risk",
    "Saving",
    "Investment",
    "Earning",
    "Spending",
    "Career Technical (CTE)"
];

const standardsFormSchema = z.object({
    title: z.string(),
    state: z.string(),
    categories: z.array(z.string()).refine((value) => value.some((item) => item), {
        message: "You have to select at least one item.",
    }),
})

export type ProfileFormValues = z.infer<typeof standardsFormSchema>
type Lesson = Awaited<ReturnType<typeof getLessonDisplay>>;
type Activity = Awaited<ReturnType<typeof getActivityDisplay>>;

interface ProfileFormProps {
    defaultValues: ProfileFormValues;
    lesson?: Lesson;
    activity?: Activity;
}

export function StandardsFilters({ defaultValues, lesson, activity }: ProfileFormProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(standardsFormSchema),
        defaultValues,
        mode: "onTouched"
    });

    const [title, setTitle] = useState(defaultValues.title);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleRemoveLesson = () => {
        const current = new URLSearchParams(Array.from(searchParams!.entries()));
        current.delete("lessonId");
        const search = current.toString();
        const queryParam = search ? `?${search}` : "";
        router.push(`${pathname}${queryParam}`);
    };

    const handleRemoveActivity = () => {
        const current = new URLSearchParams(Array.from(searchParams!.entries()));
        current.delete("activityId");
        const search = current.toString();
        const queryParam = search ? `?${search}` : "";
        router.push(`${pathname}${queryParam}`);
    };

    const handleTitleChange = useCallback(async (value: string) => {
        form.setValue("title", value);
        const isValid = await form.trigger("title");
        if (!isValid) return;

        const current = new URLSearchParams(Array.from(searchParams!.entries()));
        if (value) {
            current.set("title", value);
        } else {
            current.delete("title");
        }
        const search = current.toString();
        const queryParam = search ? `?${search}` : "";
        router.push(`${pathname}${queryParam}`);
    }, [form, router, pathname, searchParams]);

    const handleStateChange = async (value: string) => {
        form.setValue("state", value);
        const isValid = await form.trigger("state");
        if (!isValid) return;

        const current = new URLSearchParams(Array.from(searchParams!.entries()));
        if (value) {
            current.set("state", value);
        } else {
            current.delete("state");
        }
        const search = current.toString();
        const queryParam = search ? `?${search}` : "";
        router.push(`${pathname}${queryParam}`);
    };

    const handleCategoriesChange = async (value: string[]) => {
        form.setValue("categories", value);
        const isValid = await form.trigger("categories");
        if (!isValid) return;

        const current = new URLSearchParams(Array.from(searchParams!.entries()));
        if (value.length > 0) {
            console.log("value", value);
            current.set("categories", value.join(","));
        } else {
            current.delete("categories");
        }
        const search = current.toString();
        const queryParam = search ? `?${search}` : "";
        router.push(`${pathname}${queryParam}`);
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            handleTitleChange(title);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [title, handleTitleChange]);
    
    return (
        <>
            {lesson && (
                <div className="mb-8">
                    <Label>Lesson</Label>
                    <Button variant="outline" onClick={handleRemoveLesson} className="w-full justify-between overflow-hidden">
                        <p className="truncate">{lesson.title}</p> <X className="ml-2" />
                    </Button>
                </div>
            )}
            {activity && (
                <div className="mb-8">
                    <Label>Activity</Label>
                    <Button variant="outline" onClick={handleRemoveActivity} className="w-full justify-between">
                        <span className="flex flex-row gap-2 items-center overflow-hidden">{activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />} <p className="truncate">{activity.title}</p></span> <X className="ml-2" />
                    </Button>
                </div>
            )}
            <Form {...form}>
                <form className="space-y-8">
                    <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>State</FormLabel>
                                <Select {...field} onValueChange={async (value) => {
                                    await handleStateChange(value);
                                }} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a State" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {states.map((state) => (
                                            <SelectItem key={state} value={state}>{state}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Input
                                            placeholder="Search by name..."
                                            {...field}
                                            value={title}
                                            onChange={async (e) => {
                                                const value = e.target.value;
                                                setTitle(value);
                                                await handleTitleChange(value);
                                            }}
                                        />
                                        <Search className="absolute right-2.5 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="space-y-4">
                        <Label>Categories</Label>
                        {categories.map((category) => (
                            <FormField
                                key={category}
                                control={form.control}
                                name="categories"
                                render={({ field }) => {
                                    return (
                                        <FormItem
                                            key={category}
                                            className="flex flex-row items-start space-x-3 space-y-0"
                                        >
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value?.includes(category)}
                                                    onCheckedChange={async (checked) => {
                                                        const updatedCategories = checked
                                                            ? [...field.value, category]
                                                            : field.value?.filter((value) => value !== category);
                                                        await handleCategoriesChange(updatedCategories);
                                                    }}
                                                />
                                            </FormControl>
                                            <FormLabel className="text-sm font-normal">
                                                {category}
                                            </FormLabel>
                                        </FormItem>
                                    );
                                }}
                            />
                        ))}
                    </div>
                </form>
            </Form>
        </>
    )
}