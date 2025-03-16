"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState, useEffect } from 'react';
import { Search } from "lucide-react";

import { toast } from "sonner";
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

interface ProfileFormProps {
    defaultValues: ProfileFormValues;
}

export function StandardsFilters({ defaultValues }: ProfileFormProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(standardsFormSchema),
        defaultValues,
        mode: "onTouched"
    });

    const [title, setTitle] = useState(defaultValues.title);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        const handler = setTimeout(() => {
            console.log("Setting title");
            form.setValue("title", title);
            form.trigger("title");
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [title, form]);

    async function onChange(data: ProfileFormValues) {
        try {
            form.reset(data);
            const current = new URLSearchParams(Array.from(searchParams!.entries()));

            if (data.title) {
                current.set("title", data.title);
            } else {
                current.delete("title");
            }

            if (data.state) {
                current.set("state", data.state);
            } else {
                current.delete("state");
            }

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
            <form onChange={form.handleSubmit(onChange)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                        onChange={(e) => setTitle(e.target.value)}
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
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([...field.value, category])
                                                        : field.onChange(
                                                            field.value?.filter(
                                                                (value) => value !== category
                                                            )
                                                        )
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            {category}
                                        </FormLabel>
                                    </FormItem>
                                )
                            }}
                        />
                    ))}
                </div>
            </form>
        </Form>
    )
}