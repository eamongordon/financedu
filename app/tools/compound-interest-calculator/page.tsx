import Banner from "@/components/banner";
import { CompoundInterestForm } from "@/components/tools/compound-interest-form";

const breadcrumbs = [
    { href: "/tools", label: "Tools" },
    { href: "/tools/compound-interest-calculator", label: "Compound Interest Calculator" },
];

export default function CompoundInterestCalculatorPage() {
    return (
        <div>
            <Banner title="Compound Interest Calculator" breadcrumbs={breadcrumbs}/>
            <CompoundInterestForm />
        </div>
    );
}