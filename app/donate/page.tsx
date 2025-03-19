import { Metadata } from "next";
import Banner from "@/components/banner";
import { DonationForm } from "@/components/donate/donate-form";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Donate',
    description: 'As a 501(c)(3) non-profit, Financedu relies on your donations to provide financial education for youth, free of cost. Make a tax-deductible donation today!'
}

export default function DonatePage() {
    return (
        <main>
            <Banner title="Donate" className="bg-gradient-to-tr from-primary to-chart-4" />
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-1/2 flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
                    <h1 className="text-3xl font-bold">Support Us</h1>
                    <p className="text-lg text-muted-foreground">
                        We are a 501(c)(3) non-profit and rely on your donations to fulfill our mission. All of your contributions to our organization are tax-deductible.
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Interested in sponsoring? We&apos;d love to hear from you! Please <Link href="/policy#contact" className="text-primary underline">contact us</Link>.
                    </p>
                </div>
                <div className="w-1/2 flex justify-center items-center bg-muted/60 p-4 md:p-8">
                    <div className="w-full max-w-sm">
                        <DonationForm />
                    </div>
                </div>
            </div>
        </main>
    );
}

