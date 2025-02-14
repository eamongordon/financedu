import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Question } from "@/types";

export function MatchingQuestion({ question }: { question: Question }) {
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

    function onSubmit(data: z.infer<typeof FormSchema>) {
        console.log(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-4/5 space-y-6">
                <div className="mb-4 space-y-4">
                    <FormLabel className="text-base font-semibold" dangerouslySetInnerHTML={{ __html: question.instructions ?? "" }} />
                </div>
                <div className="flex flex-col space-y-0 gap-0 border-t border-b divide-y">
                    {question.matchingSubquestions?.map((subquestion) => (
                        <FormField
                            key={subquestion.id}
                            control={form.control}
                            name={subquestion.id}
                            render={({ field }) => (
                                <FormItem className="flex justify-between items-center space-y-0 p-4">
                                    <FormLabel>{subquestion.instructions}</FormLabel>
                                    <FormControl className="flex justify-center items-center">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {question.matchingOptions?.map((option) => (
                                                    <SelectItem key={option.id} value={option.value}>{option.value}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                </div>
            </form>
        </Form>
    );
}
