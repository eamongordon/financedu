import type { Metadata } from "next";
import Banner from "@/components/banner";
import { SimpleInterestForm } from "@/components/tools/simple-interest-form";

const breadcrumbs = [
    { href: "/resources", label: "Resources" },
    { href: "/tools/simple-interest-calculator", label: "Simple Interest Calculator" },
];

export const metadata: Metadata = {
    title: "Simple Interest Calculator",
    description: "Explore simple interest with an interactive calculator.",
};

export default function CompoundInterestCalculatorPage() {
    return (
        <div>
            <Banner title="Simple Interest Calculator" breadcrumbs={breadcrumbs} className="from-chart-4 to-chart-5" />
            <SimpleInterestForm />
        </div>
    );
}