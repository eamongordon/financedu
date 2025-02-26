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
import { cn } from "@/lib/utils"

export function MultiselectQuestion({ question, onResponseChange, onValidChange, showAnswer }: { question: Question, onResponseChange: (response: string[]) => void, onValidChange: (isValid: boolean) => void, showAnswer: boolean }) {
    const questionOptionIds = question.questionOptions.map((questionOption) => questionOption.id);

    const FormSchema = z.object({
        items: z.array(z.string().refine((item) => questionOptionIds.includes(item), {
            message: "Invalid item selected.",
        })).refine((value) => value.some((item) => item), {
            message: "Please select at least each one option.",
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            items: [],
        },
        mode: "onChange"
    })

    function onChange(data: z.infer<typeof FormSchema>) {
        onResponseChange(data.items);
    }

    useEffect(() => {
        onValidChange(form.formState.isValid);
    }, [form.formState.isValid, onValidChange]);

    return (
        <Form {...form}>
            <form onChange={form.handleSubmit(onChange)} className="w-4/5 space-y-6">
                <FormField
                    control={form.control}
                    name="items"
                    render={() => (
                        <FormItem>
                            <div className="mb-4 space-y-4">
                                <FormLabel className="text-base font-semibold">{question.instructions}</FormLabel>
                                <FormDescription>
                                    Select all that apply:
                                </FormDescription>
                            </div>
                            <div className="flex flex-col space-y-0 gap-0 border-t border-b divide-y">
                                {question.questionOptions.map((questionOption) => {
                                    const isSelected = form.watch("items").includes(questionOption.id);
                                    const isCorrect = questionOption.isCorrect;

                                    return (
                                        <FormField
                                            key={questionOption.id}
                                            control={form.control}
                                            name="items"
                                            render={({ field }) => (
                                                <FormItem
                                                    key={questionOption.id}
                                                    className="flex flex-row items-center gap-3 space-x-3 space-y-0 p-4 cursor-pointer group"
                                                >
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={(checked) => {
                                                                return checked
                                                                    ? field.onChange([...field.value, questionOption.id])
                                                                    : field.onChange(
                                                                        field.value?.filter(
                                                                            (value) => value !== questionOption.id
                                                                        )
                                                                    );
                                                            }}
                                                            disabled={showAnswer}
                                                            className={cn(
                                                                "scale-125 border-input group-hover:border-foreground",
                                                                showAnswer
                                                                    ? isSelected
                                                                        ? isCorrect
                                                                            ? "bg-primary border-primary"
                                                                            : "data-[state=checked]:bg-destructive bg-destructive border-destructive"
                                                                        : isCorrect
                                                                            ? "bg-destructive border-destructive"
                                                                            : "border-input"
                                                                    : isSelected
                                                                        ? "bg-primary border-primary"
                                                                        : "border-input"
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="flex flex-col gap-1 cursor-pointer">
                                                        {showAnswer && <div className={cn(
                                                            "text-sm leading-none",
                                                            isCorrect ? (isSelected ? "text-primary" : "text-destructive") :
                                                                isSelected ? "text-destructive" :
                                                                    "text-muted-foreground"
                                                        )}>{isCorrect ? (isSelected ? "CORRECT (SELECTED)" : "CORRECT (NOT SELECTED)") : isSelected ? "INCORRECT (SELECTED)" : "INCORRECT"}:</div>}
                                                        <h1 className="text-base">{questionOption.value}</h1>
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    )
                                })}
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
