import { Metadata } from "next";
import Banner from "@/components/banner";
import { DonationForm } from "@/components/donate/donate-form";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

export const metadata: Metadata = {
    title: 'Donate',
    description: 'As a 501(c)(3) non-profit, Financedu relies on your donations to provide financial education for youth, free of cost. Make a tax-deductible donation today!'
}

export default function DonatePage() {
    return (
        <main>
            <Banner title="Donate" className="bg-gradient-to-tr from-primary to-chart-4" />
            <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2 flex flex-col gap-8 p-4 sm:p-6 lg:p-8">
                    <h1 className="text-3xl font-bold">Support Us</h1>
                    <p className="text-lg text-muted-foreground">
                        We are a 501(c)(3) non-profit and rely on your donations to fulfill our mission. All of your contributions to our organization are tax-deductible.
                    </p>
                    <p className="text-lg text-muted-foreground">
                        Interested in sponsoring? We&apos;d love to hear from you! Please <Link href="/policy#contact" className="text-primary underline">contact us</Link>.
                    </p>
                </div>
                <div className="w-full md:w-1/2 flex justify-center items-center bg-muted/60 p-4 md:p-8">
                    <div className="w-full md:max-w-sm">
                        <DonationForm />
                    </div>
                </div>
            </div>
            <div className="px-4 sm:px-6 lg:px-8 py-8 space-y-2">
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible>
                    <AccordionItem value="1">
                        <AccordionTrigger>Which Methods of Payment do you accept?</AccordionTrigger>
                        <AccordionContent>
                            Online donations are processed via Stripe, which accepts Credit Cards. If you would like to donate using a different method, please <Link href="/policy#contact" className="text-primary underline">contact us</Link>.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="2">
                        <AccordionTrigger>Are My Donations Tax-Deductible?</AccordionTrigger>
                        <AccordionContent>
                            As a 501(c)(3) non-profit in the United States, are donations are tax-deductible in accordance to the law. Our tax identification number/EIN is <strong>92-3500587 .</strong>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="3">
                        <AccordionTrigger>What is your Tax ID number?</AccordionTrigger>
                        <AccordionContent>
                            Our tax identification number/EIN is <strong>92-3500587.</strong>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="4">
                        <AccordionTrigger>Where can I manage, update or cancel my recurring donation?</AccordionTrigger>
                        <AccordionContent>
                            To manage, update or cancel your recurring donation, please <Link href="/policy#contact" className="text-primary underline">contact us</Link>.
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="5">
                        <AccordionTrigger>Can I sponsor Financedu?</AccordionTrigger>
                        <AccordionContent>
                            Yes! Please <Link href="/policy#contact" className="text-primary underline">contact us</Link> for more information.
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </main>
    );
}

