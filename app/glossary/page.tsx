import Banner from "@/components/banner";
import { buttonVariants } from "@/components/ui/button";
import { getGlossary } from "@/lib/fetchers";
import { cn } from "@/lib/utils";
import Link from "next/link";

type GlossaryTerm = {
    id: string;
    slug: string;
    title: string;
    definition: string;
};

export default async function GlossaryPage() {
    const glossary: GlossaryTerm[] = await getGlossary();
    const groupedGlossary: { [key: string]: GlossaryTerm[] } = glossary.reduce((acc, term) => {
        const firstLetter = term.title[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(term);
        return acc;
    }, {} as { [key: string]: GlossaryTerm[] });

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    return (
        <main>
            <Banner title="Glossary" className="from-[#02CF46] to-[#79D6F1] bg-gradient-to-tr" />
            <nav className="px-4 sm:px-6 lg:px-8 flex flex-wrap justify-center w-full bg-muted overflow-auto">
                {alphabet.map(letter => (
                    <Link href={`#${letter}`} key={letter} className={cn(buttonVariants({ variant: "ghost" }), "font-semibold text-lg h-12")}>
                        {letter}
                    </Link>
                ))}
            </nav>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
                {alphabet.map(letter => (
                    <section key={letter} id={letter} className="py-4 space-y-2">
                        <h2 className="text-secondary font-semibold text-4xl">{letter}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                            {groupedGlossary[letter]?.map(term => (
                                <Link key={term.id} href={`/glossary/${term.slug}`} className="text-lg font-semibold text-muted-foreground">
                                    {term.title}
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </main>
    );
}