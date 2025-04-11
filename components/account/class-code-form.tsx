"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner"

const FormSchema = z.object({
  code: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

const REGEXP_ONLY_DIGITS_AND_CHARS = /^[a-zA-Z0-9]*$/

export function ClassCodeForm({ isInvalidCode, rerenderKey }: { isInvalidCode?: boolean, rerenderKey?: string }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      code: "",
    },
  })

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isInvalidCode) {
      form.setError("code", {
        type: "manual",
        message: "Invalid class code. Please try again.",
      });
      setLoading(false);
      toast.error("Invalid class code. Please try again.");
    }
  }, [rerenderKey, isInvalidCode, form]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    router.push(`/join/${data.code}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem className="space-y-4">
              <FormLabel className="text-center text-lg text-muted-foreground">Enter your class code.</FormLabel>
              <FormControl>
                {/*@ts-expect-error todo: address regex prop*/}
                <InputOTP inputMode="text" maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS_AND_CHARS}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} autoCapitalize="on" className="text-2xl size-16" />
                    <InputOTPSlot index={1} autoCapitalize="on" className="text-2xl size-16" />
                    <InputOTPSlot index={2} autoCapitalize="on" className="text-2xl size-16" />
                    <InputOTPSlot index={3} autoCapitalize="on" className="text-2xl size-16" />
                    <InputOTPSlot index={4} autoCapitalize="on" className="text-2xl size-16" />
                    <InputOTPSlot index={5} autoCapitalize="on" className="text-2xl size-16" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size="lg" type="submit" className="w-96" isLoading={loading}>Join</Button>
      </form>
    </Form>
  )
}
