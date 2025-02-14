import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Question } from "@/types";
import { cn } from "@/lib/utils";

export function MatchingQuestion({ question, onResponseChange, onValidChange, showAnswer }: { question: Question, onResponseChange: (response: { id: string, response: string }[]) => void, onValidChange: (isValid: boolean) => void, showAnswer: boolean }) {
    const subquestionSchema = question.matchingSubquestions.reduce((schema: { [key: string]: z.ZodString }, subquestion) => {
        schema[subquestion.id] = z.string();
        return schema;
    }, {});

    const FormSchema = z.object(subquestionSchema);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange"
    });

    useEffect(() => {
        onValidChange(form.formState.isValid);
    }, [form.formState.isValid, onValidChange]);

    function onChange(data: z.infer<typeof FormSchema>) {
        const responseArray = Object.entries(data).map(([id, response]) => ({ id, response }));
        onResponseChange(responseArray);
    }

    return (
        <Form {...form}>
            <form onChange={form.handleSubmit(onChange)} className="w-4/5">
                <div className="pb-4 space-y-4 border-b">
                    <FormLabel className="text-base font-semibold" dangerouslySetInnerHTML={{ __html: question.instructions ?? "" }} />
                </div>
                {question.matchingSubquestions?.map((subquestion) => (
                    <FormField
                        key={subquestion.id}
                        control={form.control}
                        name={subquestion.id}
                        render={({ field }) => {
                            const isCorrect = field.value === subquestion.correctMatchingOptionId;
                            return (
                                <FormItem className="flex justify-between items-center space-y-0 p-4 border-b">
                                    <FormLabel className="flex flex-col gap-2 text-inherit">
                                        {showAnswer && (<p className={cn("leading-none", isCorrect ? "text-primary" : "text-destructive")}>{isCorrect ? "CORRECT" : "INCORRECT"}</p>)}
                                        <p>{subquestion.instructions}</p>
                                    </FormLabel>
                                    <FormControl className="flex justify-center items-center">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            disabled={showAnswer}
                                        >
                                            <SelectTrigger
                                                className={cn("w-[180px]", showAnswer && (isCorrect ? "border-primary" : "border-destructive"))}
                                            >
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {question.matchingOptions?.map((option) => (
                                                    <SelectItem key={option.id} value={option.id}>{option.value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            );
                        }}
                    />
                ))}
            </form>
        </Form>
    );
}
