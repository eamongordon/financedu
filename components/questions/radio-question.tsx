"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Question } from "@/types"
import { Label } from "../ui/label"
import { cn } from "@/lib/utils"

export function RadioQuestion({ question, onResponseChange, onValidChange, showCorrectAnswer }: { question: Question, onResponseChange: (response: string) => void, onValidChange: (isValid: boolean) => void, showCorrectAnswer: boolean }) {
    const questionOptionIds = question.questionOptions.map((questionOption) => questionOption.id);

    if (questionOptionIds.length === 0) {
        throw new Error("No question options available.");
    }

    const FormSchema = z.object({
        type: z.enum([questionOptionIds[0], ...questionOptionIds.slice(1)], {
            required_error: "You need to select a notification type.",
        }),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange"
    })

    useEffect(() => {
        onValidChange(form.formState.isValid);
    }, [form.formState.isValid, onValidChange]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
        onResponseChange(data.type);
        onValidChange(form.formState.isValid);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-4/5 space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <div className="mb-4 space-y-4">
                                <FormLabel className="text-base font-semibold">{question.instructions}</FormLabel>
                                <FormDescription>
                                    Choose 1 answer:
                                </FormDescription>
                            </div>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value);
                                        onResponseChange(value);
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-0 gap-0 border-t border-b divide-y"
                                >
                                    {question.questionOptions.map((questionOptions) => (
                                        <FormItem key={questionOptions.id} className="space-y-0">
                                            <FormControl className="sr-only">
                                                <RadioGroupItem id={questionOptions.id} value={questionOptions.id} className="peer sr-only" disabled={showCorrectAnswer} />
                                            </FormControl>
                                            <Label
                                                htmlFor={questionOptions.id}
                                                className="flex flex-row justify-between p-4 cursor-pointer text-base"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span className={cn(
                                                        "mr-2 size-4 rounded-full ring-1 ring-offset-2",
                                                        field.value === questionOptions.id && !showCorrectAnswer ? 'bg-primary ring-primary' :
                                                            questionOptions.isCorrect && field.value === questionOptions.id ? 'bg-primary ring-primary' :
                                                                field.value === questionOptions.id ? 'bg-destructive ring-destructive' :
                                                                    'ring-border'
                                                    )}></span>
                                                    <div className="flex flex-col gap-1">
                                                        {showCorrectAnswer && <div className={cn(
                                                            "text-sm leading-none",
                                                            questionOptions.isCorrect && field.value === questionOptions.id ? "text-primary" :
                                                                field.value === questionOptions.id ? "text-destructive" :
                                                                    "text-muted-foreground"
                                                        )}>{questionOptions.isCorrect ? "CORRECT" : "INCORRECT"} {field.value === questionOptions.id && "(SELECTED)"}:</div>}
                                                        <h1 className="text-base">{questionOptions.value}</h1>
                                                    </div>
                                                </span>
                                            </Label>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    )
}
