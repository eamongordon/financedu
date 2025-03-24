import type { Metadata } from 'next';
import Banner from "@/components/banner";
import { CloudsDarkClass, CloudsLightClass } from "@/components/illustrations/clouds";
import { DividerWaves } from "@/components/illustrations/divider-waves";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { DividerWedge } from '@/components/illustrations/divider-wedge';

export const metadata: Metadata = {
    title: 'Volunteer',
    description: 'Financedu is a 501(c)(3) non-profit, and volunteers, like you, power our success! Experience or none, everyone is a good fit to volunteer.'
}

export default function VolunteerPage() {
    return (
        <main>
            <Banner title="Volunteer" className="from-[#02CF46] to-[#00B5EA] bg-gradient-to-r" />
            <div className="space-y-4 mx-0 md:mx-12 py-8 md:py-16">
                <h1 className="text-center font-semibold text-2xl sm:text-3xl">Thanks for your Interest!</h1>
                <p className="text-center text-lg text-muted-foreground">Financedu is a 501(c)(3) non-profit, and volunteers, like you, power our success! Experience or none, everyone is a good fit to volunteer.</p>
            </div>
            <div className="space-y-4">
                <div className={`dark:hidden h-12 w-full bg-repeat-x ${CloudsLightClass}`} />
                <div className={`hidden dark:block h-12 w-full bg-repeat-x ${CloudsDarkClass}`} />
            </div>
            <section className='relative py-12'>
                <div className='flex flex-col md:flex-row gap-4'>
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
                    <div className="flex flex-col md:flex-row-reverse items-center justify-between p-8 gap-4">
                        <div className="md:w-1/2 md:flex md:justify-end z-10">
                            <Image
                                height={100}
                                width={300}
                                src="/volunteer-workshop.jpeg"
                                alt="Volunteer Workshop"
                                className="rounded-lg"
                            />
                        </div>
                        <div className="md:w-1/2 mt-4 md:mt-0 md:ml-8 z-10 space-y-3">
                            <p className="text-lg">
                                At the moment, we&apos;re looking for help in the following areas:
                            </p>
                            <ul className="ml-4 list-disc text-lg">
                                <li>
                                    <p><strong>Giving Feedback</strong> - Your feedback on anything Financedu-related - user interface or content - is invaluable.</p>
                                </li>
                                <li>
                                    <p><strong>Content Creation</strong> - Have content you&apos;d like to share? Help us improve our courses.</p>
                                </li>
                                <li>
                                    <p><strong>Dev</strong> - Experience in either Javascript, React, React Native, or Next.js is ideal.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-0 w-full h-[200px] fill-accent/20">
                    <DividerWedge />
                </div>
                <div className="absolute bottom-0 w-full h-[180px] fill-accent/40">
                    <DividerWedge />
                </div>
                <div className="absolute bottom-0 w-full h-[150px] fill-accent/60">
                    <DividerWedge />
                </div>
                <div className="absolute bottom-0 w-full h-[120px] fill-accent/80">
                    <DividerWedge />
                </div>
            </section>
            <div className="flex flex-col items-center justify-center gap-6 bg-accent pb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold">So drop us a line!</h2>
                <div>
                    <h3 className="text-lg text-muted-foreground">Just tell us your name and what you&apos;re interested in!</h3>
                </div>
                <a href="mailto:info@financedu.org?subject=I%20Want%20To%20Volunteer!" className={cn(buttonVariants({ size: "lg" }), "text-lg")}>
                    Contact Us
                </a>
            </div>
        </main>
    );
}
