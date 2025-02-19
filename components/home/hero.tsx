import Image from "next/image";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero() {
    return (
        <div className="flex flex-col h-dvh md:h-[550px] md:flex-row">
            <div className="relative h-1/3 md:h-auto md:w-1/2">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:brightness-[0.6]"></div>
                <Image
                    src="/homepage-banner.jpg"
                    alt="Image"
                    fill
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-75 opacity-20"
                />
            </div>
            <div className="h-2/3 md:h-auto md:w-1/2 flex flex-col justify-start items-start md:justify-center md:items-center gap-4 p-6 lg:p-10 bg-muted/60">
                <div className="flex flex-col text-left md:text-left gap-6 md:gap-12">
                    <h1 className="text-[26px] md:text-left md:text-5xl font-semibold">Financial Education For Youth</h1>
                    <p className="text-lg text-muted-foreground">Empowering youth to live successful financial lives through online, cost-free, and customizable curricula.</p>
                    <div className="flex flex-row justify-center md:justify-normal flex-wrap lg:flex-nowrap gap-2 lg:gap-4">
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-32 lg:w-[140px]")}>Learners</Link>
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-32 lg:w-[140px]")}>Parents</Link>
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-32 lg:w-[140px]")}>Educators</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}