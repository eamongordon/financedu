import { Question } from "@/types";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useEffect } from "react";

const FormSchema = z.object({
    response: z.string().min(1, "Give it a try—there are no wrong answers."),
});

export function TextQuestion({ question, onResponseChange, onValidChange, showAnswer }: { question: Question, onResponseChange: (response: string) => void, onValidChange: (isValid: boolean) => void, showAnswer: boolean }) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            response: "",
        },
    });

    function onChange(data: z.infer<typeof FormSchema>) {
        onResponseChange(data.response);
    }

    useEffect(() => {
        onValidChange(form.formState.isValid);
    }, [form.formState.isValid, onValidChange]);

    return (
        <Form {...form}>
            <form onChange={form.handleSubmit(onChange)} className="w-2/3 space-y-6">
                <FormField
                    control={form.control}
                    name="response"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel dangerouslySetInnerHTML={{ __html: question.instructions ?? "" }} />
                            <FormControl>
                                <Textarea disabled={showAnswer} placeholder={question.placeholder ?? undefined} {...field} />
                            </FormControl>
                            <FormDescription className={showAnswer ? "text-primary" : ""}>
                                {showAnswer && "Answer submitted."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </form>
        </Form>
    );
}
