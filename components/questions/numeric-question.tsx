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
  response: z.number(),
})

export function NumericQuestion({ question, onResponseChange, onValidChange }: { question: Question, onResponseChange: (response: number) => void, onValidChange: (isValid: boolean) => void }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange"
  })

  useEffect(() => {
    onValidChange(form.formState.isValid);
  }, [form.formState.isValid, onValidChange]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data);
    console.log(question);
    onResponseChange(data.response);
    onValidChange(form.formState.isValid);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        <FormField
          control={form.control}
          name="response"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number</FormLabel>
              <FormControl>
                <Input {...field} onChange={(e) => {
                  field.onChange(e);
                  onResponseChange(Number(e.target.value));
                }} />
              </FormControl>
              <FormDescription>
                Enter a Response
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
