import Image from "next/image";
import { Button, buttonVariants } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Hero() {
    return (
        <div className="grid min-h-[550px] md:grid-cols-2">
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B5EA] to-[#02CF46]"></div>
                <Image
                    src="/financedu-homepage_banner.jpeg"
                    alt="Image"
                    fill
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                />
            </div>
            <div className="flex flex-col justify-start items-start md:justify-center md:items-center gap-4 p-6 lg:p-10 bg-muted/60">
                <div className="flex flex-col text-center md:text-left gap-6 md:gap-12">
                    <h1 className="text-2xl md:text-left md:text-5xl font-semibold">Financial Education For Youth</h1>
                    <p className="text-xl text-muted-foreground">Empowering youth to live successful financial lives through online, cost-free, and customizable curricula.</p>
                    <div className="flex flex-row justify-center md:justify-normal flex-wrap gap-2 lg:gap-4">
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-32 lg:w-[140px]")}>Learners</Link>
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-32 lg:w-[140px]")}>Parents</Link>
                        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "w-full md:w-32 lg:w-[140px]")}>Educators</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}