"use client";

import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useSelectedLayoutSegment } from "next/navigation";

const navItems = [
    {
        name: "Courses",
        href: "/account/learner",
        segment: null
    },
    {
        name: "Progress",
        href: "/account/learner/progress",
        segment: "progress"
    }
];

export function LearnerNav() {
    const segment = useSelectedLayoutSegment();
    return (
        <Tabs defaultValue={segment ?? "Courses"} className="py-6">
            <TabsList className="bg-inherit gap-7">
                {navItems.map((item) => (
                    <TabsTrigger
                        key={item.name}
                        value={item.name}
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