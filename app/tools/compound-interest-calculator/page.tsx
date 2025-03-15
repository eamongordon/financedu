import type { Metadata } from "next";
import Banner from "@/components/banner";
import { CompoundInterestForm } from "@/components/tools/compound-interest-form";

const breadcrumbs = [
    { href: "/tools", label: "Tools" },
    { href: "/tools/compound-interest-calculator", label: "Compound Interest Calculator" },
];

export const metadata: Metadata = {
    title: "Compound Interest Calculator",
    description: "Explore compound interest with an interactive calculator.",
};

export default function CompoundInterestCalculatorPage() {
    return (
        <div>
            <Banner title="Compound Interest Calculator" breadcrumbs={breadcrumbs} className="from-chart-1 to-primary/85" />
            <CompoundInterestForm />
        </div>
    );
}