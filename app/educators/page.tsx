import Banner from "@/components/banner";
import { CloudsDarkClass, CloudsLightClass } from "@/components/illustrations/clouds";
import { DividerStripes } from "@/components/illustrations/divider-stripes";
import { DividerWaves } from "@/components/illustrations/divider-waves";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function EducatorPage() {
    return (
        <>
            <Banner title="Educators" className="from-[#02CF46] to-[#00B5EA] bg-gradient-to-r" />
            <main>
                <div className="space-y-4 mx-0 md:mx-12 py-8 md:py-16">
                    <h1 className="text-center font-semibold text-2xl sm:text-3xl">Bring Financial Education to your Class</h1>
                    <p className="text-center text-lg text-muted-foreground">In addition to students, and parents, Financedu offers a platform for students and teachers to utilize our courses and resources.</p>
                </div>
                <div className="space-y-4">
                    <div className={`dark:hidden h-12 w-full bg-repeat-x ${CloudsLightClass}`} />
                    <div className={`hidden dark:block h-12 w-full bg-repeat-x ${CloudsDarkClass}`} />
                </div>
                <div className="relative pt-16 md:pt-20">
                    <div className="rotate-180 absolute top-0 w-full h-[110px] text-sky-100/20 dark:text-sky-900/20">
                        <DividerWaves />
                    </div>
                    <div className="rotate-180 absolute top-0 w-full h-[90px] text-sky-100/40 dark:text-sky-900/40">
                        <DividerWaves />
                    </div>
                    <div className="rotate-180 absolute top-0 w-full h-[70px] text-sky-100/60 dark:text-sky-900/60">
                        <DividerWaves />
                    </div>
                    <div className="rotate-180 absolute top-0 w-full h-[50px] text-sky-100/80 dark:text-sky-900/80">
                        <DividerWaves />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between p-8">
                        <div className="md:w-1/2">
                            <Image
                                src="/assignments-light.png"
                                alt="Homepage Banner"
                                width={800}
                                height={500}
                                className="dark:hidden w-full object-cover md:w-4/5 h-52 md:h-auto rounded-lg border-2 border-primary"
                            />
                            <Image
                                src="/assignments-dark.png"
                                alt="Homepage Banner"
                                width={800}
                                height={500}
                                className="hidden dark:block w-full object-cover md:w-4/5 h-52 md:h-auto rounded-lg border-2 border-primary"
                            />
                        </div>
                        <div className="md:w-1/2 mt-4 md:mt-0 md:ml-8">
                            <h1 className="text-3xl font-bold mb-4">Customized Lessons & Assignments</h1>
                            <p className="text-lg text-muted-foreground">Personalize your students&apos; experience with custom assignments including individual lessons and activities from our courses.</p>
                        </div>
                    </div>
                </div>
                <div className="relative pb-20">
                    <div className="flex flex-col md:flex-row-reverse items-center justify-between p-8">
                        <div className="md:w-1/2 md:flex md:justify-end z-10">
                            <Image
                                src="/gradebook-light.png"
                                alt="Homepage Banner"
                                width={800}
                                height={500}
                                className="dark:hidden w-full object-cover md:w-4/5 h-52 md:h-auto rounded-lg border-2 border-primary"
                            />
                            <Image
                                src="/gradebook-dark.png"
                                alt="Homepage Banner"
                                width={800}
                                height={500}
                                className="hidden dark:block w-full object-cover md:w-4/5 h-52 md:h-auto rounded-lg border-2 border-primary"
                            />
                        </div>
                        <div className="md:w-1/2 mt-4 md:mt-0 md:ml-8 z-10">
                            <h1 className="text-3xl font-bold mb-4">Track & Analyze Student Progress</h1>
                            <p className="text-lg text-muted-foreground">Track students&apos; concept mastery, accuracy, and timeliness with analytics and insights.</p>
                        </div>
                    </div>
                    <div className="absolute bottom-0 h-48 z-0 w-full text-muted/50">
                        <DividerStripes />
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-6 bg-muted/50 pb-8 text-center">
                    <h2 className="text-2xl sm:text-3xl font-semibold">Sign Up</h2>
                    <div>
                        <h3 className="text-lg text-muted-foreground">Our platform for teachers, schools, and districts is currently in beta.</h3>
                        <p className="text-lg text-muted-foreground font-semibold">Sign up as a teacher or administrator and try it out!</p>
                    </div>
                    <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "text-lg")}>
                        Sign Up
                    </Link>
                </div>
            </main>
        </>
    );
}
