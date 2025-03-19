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
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils";
import { createCheckoutSession } from "@/lib/actions";
import { redirect } from "next/navigation";

const donationFormSchema = z.object({
    donationType: z.enum(["one-time", "recurring"]),
    frequency: z.enum(["month", "year"]).optional(),
    amount: z.enum(["10", "20", "50", "200"]),
    customAmount: z.coerce.number().min(1, "Please enter a donation of at least $1.").optional()
})

type DonationFormValues = z.infer<typeof donationFormSchema>

export function DonationForm() {

    const form = useForm<DonationFormValues>({
        resolver: zodResolver(donationFormSchema),
        defaultValues: {
            donationType: "one-time",
            frequency: "month",
            amount: "10"
        },
    });

    async function onSubmit(data: DonationFormValues) {
        const dollarAmount = data.customAmount ?? Number(data.amount);
        const frequency = data.donationType === "recurring" ? data.frequency : undefined;
        const name = data.donationType === "recurring" ? "Recurring Donation" : "One Time Donation";
        const checkoutUrl = await createCheckoutSession({ name, dollarAmount, frequency });
        if (!checkoutUrl) {
            throw new Error("Failed to create checkout session");
        }
        redirect(checkoutUrl);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="donationType"
                    render={({ field }) => (
                        <FormItem>
                            <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-0">
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="one-time" id="one-time" className="peer sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor="one-time"
                                        className="h-10 inline-flex items-center justify-center w-full hover:bg-accent font-semibold rounded-l-md bg-popover border-muted border-l-2 border-t-2 border-b-2 peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:text-primary-foreground [&:has([data-state=checked])]:border-primary"
                                    >
                                        One Time
                                    </Label>
                                </FormItem>
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="recurring" id="recurring" className="peer sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor="recurring"
                                        className="h-10 inline-flex items-center justify-center w-full hover:bg-accent font-semibold rounded-r-md bg-popover border-muted border-r-2 border-t-2 border-b-2 peer-data-[state=checked]:bg-primary [&:has([data-state=checked])]:bg-primary peer-data-[state=checked]:text-primary-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:text-primary-foreground [&:has([data-state=checked])]:border-primary"
                                    >
                                        Recurring
                                    </Label>
                                </FormItem>
                            </RadioGroup>
                        </FormItem>
                    )}
                />
                {form.watch("donationType") === "recurring" && (
                    <FormField
                        control={form.control}
                        name="frequency"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-row gap-8"
                                    >
                                        <FormItem className="space-y-0">
                                            <FormControl className="sr-only">
                                                <RadioGroupItem id="month" value="month" className="peer sr-only" />
                                            </FormControl>
                                            <Label
                                                htmlFor="month"
                                                className="flex flex-row justify-between cursor-pointer text-base group"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span
                                                        className={cn(
                                                            "mr-2 size-4 rounded-full outline outline-1 outline-offset-2 group-hover:outline-foreground",
                                                            field.value === "month" ? "bg-primary outline-primary" : "outline-input"
                                                        )}
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <h1 className="text-base">Monthly</h1>
                                                    </div>
                                                </span>
                                            </Label>
                                        </FormItem>
                                        <FormItem className="space-y-0">
                                            <FormControl className="sr-only">
                                                <RadioGroupItem id="year" value="year" className="peer sr-only" />
                                            </FormControl>
                                            <Label
                                                htmlFor="year"
                                                className="flex flex-row justify-between cursor-pointer text-base group"
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span
                                                        className={cn(
                                                            "mr-2 size-4 rounded-full outline outline-1 outline-offset-2 group-hover:outline-foreground",
                                                            field.value === "year" ? "bg-primary outline-primary" : "outline-input"
                                                        )}
                                                    />
                                                    <div className="flex flex-col gap-1">
                                                        <h1 className="text-base">Yearly</h1>
                                                    </div>
                                                </span>
                                            </Label>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                        <FormItem>
                            <RadioGroup
                                onValueChange={(event) => {
                                    form.setValue("customAmount", undefined);
                                    field.onChange(event);
                                }}
                                defaultValue={field.value}
                                className="grid grid-cols-2 gap-2">
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="10" id="10" className="peer sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor="10"
                                        className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", !form.watch("customAmount") && "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary")}
                                    >
                                        $10
                                    </Label>
                                </FormItem>
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="20" id="20" className="peer sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor="20"
                                        className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", !form.watch("customAmount") && "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary")}
                                    >
                                        $20
                                    </Label>
                                </FormItem>
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="50" id="50" className="peer sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor="50"
                                        className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", !form.watch("customAmount") && "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary")}
                                    >
                                        $50
                                    </Label>
                                </FormItem>
                                <FormItem className="space-y-0">
                                    <FormControl>
                                        <RadioGroupItem value="100" id="100" className="peer sr-only" />
                                    </FormControl>
                                    <Label
                                        htmlFor="100"
                                        className={cn("flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", !form.watch("customAmount") && "peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary")}
                                    >
                                        $100
                                    </Label>
                                </FormItem>
                                <FormField
                                    control={form.control}
                                    name="customAmount"
                                    render={({ field }) => (
                                        <FormItem className="col-span-2 space-y-0">
                                            <FormControl>
                                                <div className={cn("flex items-center w-full rounded-md border-2 border-muted bg-background text-foreground", form.getValues("customAmount") && "border-primary")}>
                                                    <div className="flex items-center h-12 px-4 text-sm text-muted-foreground border-r-2 border-muted">
                                                        USD
                                                    </div>
                                                    <div className="flex items-center pl-4 pr-0 text-sm text-muted-foreground">
                                                        $
                                                    </div>
                                                    <Input
                                                        type="number"
                                                        placeholder="Other Amount"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        className="focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 rounded-l-none rounded-r-lg border-0 bg-transparent py-2 pr-4 text-sm focus:outline-none h-12"
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </RadioGroup>
                        </FormItem>
                    )}
                />
                <Button
                    isLoading={form.formState.isSubmitting}
                    disabled={!form.formState.isDirty}
                    type="submit"
                    className="w-full"
                >
                    Continue
                </Button>
            </form>
        </Form>
    )
}