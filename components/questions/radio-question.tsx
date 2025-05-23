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

export function RadioQuestion({ question, onResponseChange, onValidChange, showAnswer }: { question: Question, onResponseChange: (response: string) => void, onValidChange: (isValid: boolean) => void, showAnswer: boolean }) {
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

    function onBlur(data: z.infer<typeof FormSchema>) {
        onResponseChange(data.type);
        onValidChange(form.formState.isValid);
    }

    return (
        <Form {...form}>
            <form onBlur={form.handleSubmit(onBlur)} className="w-4/5 space-y-6">
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
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-0 gap-0 border-t border-b divide-y"
                                >
                                    {question.questionOptions.map((questionOption) => {
                                        const isCorrect = questionOption.isCorrect;
                                        const isSelected = field.value === questionOption.id;

                                        return (
                                            <FormItem key={questionOption.id} className="space-y-0">
                                                <FormControl className="sr-only">
                                                    <RadioGroupItem id={questionOption.id} value={questionOption.id} className="peer sr-only" disabled={showAnswer} />
                                                </FormControl>
                                                <Label
                                                    htmlFor={questionOption.id}
                                                    className="flex flex-row justify-between p-4 cursor-pointer text-base group"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <span className={cn(
                                                            "mr-2 size-4 rounded-full outline outline-1 outline-offset-2 group-hover:outline-foreground",
                                                            isSelected ? (isCorrect || !showAnswer ? 'bg-primary outline-primary' : 'bg-destructive outline-destructive') : 'outline-input'
                                                        )}></span>
                                                        <div className="flex flex-col gap-1">
                                                            {showAnswer && <div className={cn(
                                                                "text-sm leading-none",
                                                                isSelected ? (isCorrect ? "text-primary" : "text-destructive") : "text-muted-foreground"
                                                            )}>{isCorrect ? "CORRECT" : "INCORRECT"} {isSelected && "(SELECTED)"}:</div>}
                                                            <h1 className="text-base">{questionOption.value}</h1>
                                                            {(showAnswer && questionOption.feedback) && <div className={cn(
                                                                "text-sm leading-none",
                                                                isSelected ? (isCorrect ? "text-primary" : "text-destructive") : "text-muted-foreground"
                                                            )}>{questionOption.feedback}</div>}
                                                        </div>
                                                    </span>
                                                </Label>
                                            </FormItem>
                                        );
                                    })}
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
