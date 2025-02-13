"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-4/5 space-y-6">
                <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem
                        >
                            <div className="mb-4 space-y-4">
                                <FormLabel className="text-base font-semibold">{question.instructions}</FormLabel>
                                <FormDescription>
                                    Select all that apply:
                                </FormDescription>
                            </div>
                            <div className="flex flex-col space-y-0 gap-0 border-t border-b divide-y">
                            {question.questionOptions.map((questionOption) => (
                                <FormField
                                    key={questionOption.id}
                                    control={form.control}
                                    name="items"
                                    render={({ field }) => {
                                        return (
                                            <FormItem
                                                key={questionOption.id}
                                                className="flex flex-row items-center gap-3 space-x-3 space-y-0 p-4"
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
                                                        className="scale-125 border-border data-[state=checked]:border-primary"
                                                    />
                                                </FormControl>
                                                <FormLabel className="text-base font-normal">
                                                    {questionOption.value}
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
