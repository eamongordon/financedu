import type { Metadata } from "next";
import Banner from "@/components/banner";
import { SavingsForm } from "@/components/tools/savings-form";

const breadcrumbs = [
    { href: "/resources", label: "Resources" },
    { href: "/tools/savings-calculator", label: "Savings Calculator" },
];

export const metadata: Metadata = {
    title: "Savings Calculator",
    description: "Calculate how much you need to save to reach your financial goals.",
};

export default function SavingsCalculatorPage() {
    return (
        <div>
            <Banner title="Savings Calculator" breadcrumbs={breadcrumbs} className="from-chart-6 to-chart-7 bg-gradient-to-tr" />
            <SavingsForm />
        </div>
    );
}