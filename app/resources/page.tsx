import type { Metadata } from "next";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import Banner from "@/components/banner";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const resources = [
    {
        title: "Compound Interest Calculator",
        description: "Calculate the compound interest on an investment or savings account.",
        href: "/tools/compound-interest-calculator",
        image: "/resources/compound-interest-calculator.png",
        type: "Calculator",
        cta: "Try it Out"
    }, {
        title: "Simple Interest Calculator",
        description: "Calculate the simple interest on a loan or investment.",
        href: "/tools/simple-interest-calculator",
        image: "/resources/simple-interest-calculator.png",
        type: "Calculator",
        cta: "Calculate Interest"
    }, {
        title: "Glossary",
        description: "A comprehensive dictionary of financial terms at your fingertips.",
        href: "/glossary",
        image: "/resources/glossary.png",
        type: "Database",
        cta: "Explore Terms"
    }, {
        title: "Financial Education Standards",
        description: "A searchable database of statewide and national financial education standards.",
        image: "/resources/financial-education-standards.png",
        type: "Database",
        cta: "View Standards",
        href: "https://www.financedu.org/standards"
    }
];

export const metadata: Metadata = {
    title: "Resources",
    description: "Browse a collection of free, detailed, and interactive financial resources, ranging from calculators to a glossary!",
};

export default function ResourcePage() {
    return (
        <div>
            <Banner title="Resources" className="from-[#A4EB9E] to-[#00B5EA] bg-gradient-to-r" />
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-screen-xl mx-auto p-4 sm:p-6 lg:p-8">
                {resources.map((resource) => (
                    <li key={resource.title} className="flex">
                        <Card className="w-full flex flex-col justify-between overflow-hidden">
                            <div>
                                <div className="relative w-full h-40 bg-[#f6efe6] dark:bg-[#f6efe6]/50">
                                    <Image
                                        src={resource.image ?? "/homepage-banner.jpg"}
                                        alt={resource.title}
                                        layout="fill"
                                        className="object-cover opacity-30 grayscale sepia-[0.6] contrast-50"
                                    />
                                </div>
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-[22px]">{resource.title}</CardTitle>
                                    <p className="text-muted-foreground text-sm mt-2">{resource.type}</p>
                                </CardHeader>
                                <CardContent className="flex flex-col gap-6">
                                    <p className="text-muted-foreground">{resource.description}</p>
                                </CardContent>
                            </div>
                            <CardFooter>
                                <Link href={resource.href} className={cn(buttonVariants(), "w-full")}>{resource.cta}</Link>
                            </CardFooter>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
}