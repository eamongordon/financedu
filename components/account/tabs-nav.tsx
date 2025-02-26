"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { usePathname } from "next/navigation";

export function TabsNav({ navItems }: { navItems: { name: string, href: string }[] }) {
    const pathname = usePathname();
    return (
        <Tabs value={pathname!} className="py-6">
            <TabsList className="bg-inherit gap-7">
                {navItems.map((item) => (
                    <TabsTrigger
                        key={item.name}
                        value={item.href}
                        className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                        asChild
                    >
                        <Link href={item.href}>{item.name}</Link>
                    </TabsTrigger>
                ))}
            </TabsList>
        </Tabs>
    );
}