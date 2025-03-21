import type { Metadata } from "next";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import FourFunctionCalculator from '@/components/tools/four-function-calculator';
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Four Function Calculator",
    description: "A simple calculator to perform arithmetic operations for our courses.",
};

export default function FourFunctionCalculatorPage() {
    return (
        <main className='mx-auto flex flex-col items-start gap-4 sm:gap-6 w-full max-w-screen-sm p-4 md:py-8'>
            <div className='space-y-2'>
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem >
                            <BreadcrumbLink asChild>
                                <Link href="/resources">Resources</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Four Function Calculator</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <h1 className='text-2xl font-bold text-center'>Four Function Calculator</h1>
            </div>
            <FourFunctionCalculator />
        </main>
    );
}