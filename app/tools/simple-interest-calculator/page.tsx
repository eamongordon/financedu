import Banner from "@/components/banner";
import { SimpleInterestForm } from "@/components/tools/simple-interest-form";

const breadcrumbs = [
    { href: "/tools", label: "Tools" },
    { href: "/tools/simple-interest-calculator", label: "Simple Interest Calculator" },
];

export default function CompoundInterestCalculatorPage() {
    return (
        <div>
            <Banner title="Simple Interest Calculator" breadcrumbs={breadcrumbs} className="from-chart-4 to-chart-5"/>
            <SimpleInterestForm />
        </div>
    );
}