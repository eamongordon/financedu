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
        schema[subquestion.id] = z.string().nonempty({ message: "This field is required" });
        return schema;
    }, {});

    const FormSchema = z.object(subquestionSchema);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: question.matchingSubquestions.reduce((values, subquestion) => {
            values[subquestion.id] = "";
            return values;
        }, {} as { [key: string]: string }),
        mode: "onChange"
    });

    useEffect(() => {
        onValidChange(form.formState.isValid);
    }, [form.formState.isValid, onValidChange]);

    function onChange(data: z.infer<typeof FormSchema>) {
        console.log("onChange")
        console.log(data);
        const responseArray = Object.entries(data).map(([id, response]) => ({ id, response }));
        onResponseChange(responseArray);
    }

    return (
        <Form {...form}>
            {/* OnChange handler not working */}
            <form className="w-4/5 space-y-6">
                <div className="mb-4 space-y-4">
                    <FormLabel className="text-base font-semibold" dangerouslySetInnerHTML={{ __html: question.instructions ?? "" }} />
                </div>
                <div className="flex flex-col space-y-0 gap-0 border-t border-b divide-y">
                    {question.matchingSubquestions?.map((subquestion) => (
                        <FormField
                            key={subquestion.id}
                            control={form.control}
                            name={subquestion.id}
                            render={({ field }) => {
                                const isCorrect = field.value === subquestion.correctMatchingOptionId;
                                return (
                                    <FormItem className="flex justify-between items-center space-y-0 p-4">
                                        <FormLabel className="flex flex-col gap-2">
                                            {showAnswer && (<p className={cn("leading-none", isCorrect ? "text-primary" : "text-destructive")}>{isCorrect ? "CORRECT" : "INCORRECT"}</p>)}
                                            <p>{subquestion.instructions}</p>
                                        </FormLabel>
                                        <FormControl className="flex justify-center items-center">
                                            <Select
                                                onValueChange={(value) => {
                                                    field.onChange(value);
                                                    onChange(form.getValues());
                                                }}
                                                defaultValue={field.value}
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
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    ))}
                </div>
            </form>
        </Form>
    );
}
