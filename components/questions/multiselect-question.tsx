"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Question } from "@/types"
import { useEffect } from "react"

export function MultiselectQuestion({ question, onResponseChange, onValidChange }: { question: Question, onResponseChange: (response: string[]) => void, onValidChange: (isValid: boolean) => void }) {
    const questionOptionIds = question.questionOptions.map((questionOption) => questionOption.id);

    const FormSchema = z.object({
        items: z.array(z.string().refine((item) => questionOptionIds.includes(item), {
            message: "Invalid item selected.",
        })).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        },
        mode: "onChange"
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        onResponseChange(data.items);
    }

    useEffect(() => {
        onValidChange(form.formState.isValid);
    }, [form.formState.isValid, onValidChange]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem>
                            <div className="mb-4">
                                <FormLabel className="text-base">Sidebar</FormLabel>
                                <FormDescription>
                                    Select the items you want to display in the sidebar.
                                </FormDescription>
                            </div>
                            {question.questionOptions.map((questionOption) => (
                                <FormField
                                    key={questionOption.id}
                                    control={form.control}
                                    name="items"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={questionOption.id}
                                                className="flex flex-row items-start space-x-3 space-y-0"
                                            >
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value?.includes(questionOption.id)}
                                                        onCheckedChange={(checked) => {
                                                            const newValue = checked
                                                                ? [...field.value, questionOption.id]
                                                                : field.value?.filter(
                                                                    (value) => value !== questionOption.id
                                                                );
                                                            field.onChange(newValue);
                                                            onResponseChange(newValue);
                                                            onValidChange(form.formState.isValid);
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-sm font-normal">
                                                    {questionOption.value}
                                                </FormLabel>
                                            </FormItem>
                                        )
                                    }}
                                />
                            ))}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}
