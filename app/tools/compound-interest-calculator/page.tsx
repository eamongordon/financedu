import Banner from "@/components/banner";
import { CompoundInterestForm } from "@/components/tools/compound-interest-form";

export default function CompoundInterestCalculatorPage() {
    return (
        <div>
            <Banner title="Compound Interest Calculator"/>
            <CompoundInterestForm />
        </div>
    );
}