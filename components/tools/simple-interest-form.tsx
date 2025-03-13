"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"
import { formatCurrency } from "@/lib/utils"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react";
import { InterestChart } from "./interest-chart";

const simpleInterestFormSchema = z.object({
    principal: z.coerce.number().min(0, "Principal must be a positive number"),
    apr: z.coerce.number().min(0, "APR must be a positive number").max(100, "APR cannot exceed 100%"),
    time: z.coerce.number().min(0, "Time must be a positive number"),
    contribute: z.boolean().optional(),
    contributionAmount: z.coerce.number().min(0, "Contribution amount must be a positive number").optional(),
})

export type SimpleInterestFormValues = z.infer<typeof simpleInterestFormSchema>

type ChartData = {
    year: number,
    principal: number,
    interest: number,
    contributions: number,
}[];

export function SimpleInterestForm() {
    const form = useForm<SimpleInterestFormValues>({
        resolver: zodResolver(simpleInterestFormSchema),
        defaultValues: {
            principal: 1000,
            apr: 3,
            time: 10,
            contribute: false,
            contributionAmount: 10,
        },
        mode: "onTouched"
    });

    const contribute = useWatch({ control: form.control, name: "contribute" });

    function calculateInterest({ principal, apr, time, contribute, contributionAmount }: SimpleInterestFormValues) {
        principal = Number(principal);
        apr = Number(apr) / 100;
        contributionAmount = Number(contributionAmount);
        const intervals = [{ amount: principal, year: 0, interestTotal: 0, contributionTotal: 0 }];
        let contributionTotal = 0;
        let interestTotal = 0;
        let amount = principal;
        for (let i = 1; i <= time; i++) {
            interestTotal += principal * apr;
            if (contribute) {
                contributionTotal += contributionAmount;
            }
            amount = principal + contributionTotal + interestTotal;
            intervals.push({ amount: amount, year: i, interestTotal: interestTotal, contributionTotal: contributionTotal });
        }
        return {
            finalAmount: principal + interestTotal + contributionTotal,
            finalInterest: interestTotal,
            finalContributions: contributionTotal,
            intervals: intervals
        };
    }

    const defaultResult = calculateInterest(form.getValues());
    const [chartData, setChartData] = useState<ChartData>(defaultResult.intervals.map((interval, index) => ({
        year: index,
        principal: interval.amount - interval.interestTotal - interval.contributionTotal,
        interest: interval.interestTotal,
        contributions: interval.contributionTotal
    })));

    async function onChange(data: SimpleInterestFormValues) {
        try {
            const result = calculateInterest(data);
            setChartData(result.intervals.map((interval, index) => ({
                year: index,
                principal: interval.amount - interval.interestTotal - interval.contributionTotal,
                interest: interval.interestTotal,
                contributions: interval.contributionTotal
            })));
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <main className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/3 bg-muted/60 px-4 md:p-6 py-4">
                <Form {...form}>
                    <form onChange={form.handleSubmit(onChange)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="principal"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Principal (USD)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Principal" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="apr"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>APR (%)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="APR" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="time"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time (years)</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Time" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contribute"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center gap-3 space-y-0 cursor-pointer group">
                                    <FormControl>
                                        <Checkbox className="border-chart-4 data-[state=checked]:bg-chart-4" checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer">Contribute during time period?</FormLabel>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {contribute && (
                            <FormField
                                control={form.control}
                                name="contributionAmount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Contribution Amount</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Contribution Amount" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </form>
                </Form>
            </div>
            <div className="w-full md:w-2/3 px-4 py-4 md:p-8 space-y-4 md:space-y-8">
                <div className="flex flex-col gap-4">
                    <h2 className="font-semibold text-lg md:text-2xl">After {chartData.length - 1} years, at an annual rate of {form.getValues("apr")}%, you would have {formatCurrency(chartData[chartData.length - 1].principal + chartData[chartData.length - 1].interest + chartData[chartData.length - 1].contributions)}</h2>
                    <div>
                        <p className="text-chart-3 text-lg font-semibold">Principal: {formatCurrency(chartData[chartData.length - 1].principal)}</p>
                        <p className="text-chart-4 text-lg font-semibold">Interest: {formatCurrency(chartData[chartData.length - 1].interest)}</p>
                        <p className="text-chart-5 text-lg font-semibold">Contributions: {formatCurrency(chartData[chartData.length - 1].contributions)}</p>
                    </div>
                </div>
                <InterestChart chartData={chartData} type="simple" />
            </div>
        </main>
    )
}