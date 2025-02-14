"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Question } from "@/types"

const FormSchema = z.object({
  response: z.coerce.number(),
})

export function NumericQuestion({ question, onResponseChange, onValidChange, showAnswer }: { question: Question, onResponseChange: (response: number) => void, onValidChange: (isValid: boolean) => void, showAnswer: boolean }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      response: "" as unknown as number
    }
  })

  useEffect(() => {
    onValidChange(form.formState.isValid);
  }, [form.formState.isValid, onValidChange]);

  function onChange(data: z.infer<typeof FormSchema>) {
    console.log(data);
    console.log(question);
    onResponseChange(data.response);
    onValidChange(form.formState.isValid);
  }

  return (
    <Form {...form}>
      <form onChange={form.handleSubmit(onChange)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input type="number" {...field} onChange={field.onChange} />
              </FormControl>
              <FormDescription>
                Enter a Response
              </FormDescription>
              <FormMessage />
              {showAnswer && <div className="text-green-500">Correct Answers</div>}
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
