import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { getGlossaryTerm } from "@/lib/actions/courses";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default async function Page({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const slug = (await params).slug;
    const term = await getGlossaryTerm(slug);

    return (
        <main className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb className="mb-4 sm:mb-8">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/glossary">Glossary</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{term.title}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div className="space-y-4 sm:space-y-6">
                <h1 className="text-2xl md:text-4xl lg:text-5xl font-semibold">{term.title}</h1>
                <p dangerouslySetInnerHTML={{ __html: term.definition }} />
                <Link href="/glossary" className={cn(buttonVariants({ variant: "link" }), "text-foreground px-0")}>
                    <ChevronLeft />
                    Back to Glossary
                </Link>
            </div>
        </main>
    );
}