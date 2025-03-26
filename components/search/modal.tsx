"use client";

import { TitleFilter } from "./title-filter";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function SearchModal({ isMobile }: { isMobile?: boolean }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {isMobile ? (
                    <Button
                        type="button"
                        variant="ghost"
                        className="[&_svg]:size-auto"
                    >
                        <Search size={24} strokeWidth={1.5} />
                    </Button>
                ) : (
                    <Button
                        type="button"
                        variant="ghost"
                        className="[&_svg]:size-auto text-primary hover:text-chart-1 hidden lg:block"
                    >
                        <Search strokeWidth={1.5} />
                    </Button>
                )}
            </SheetTrigger>
            <SheetContent side="top" className="[&>button]:hidden">
                <SheetHeader className="sr-only">
                    <SheetTitle className="sr-only">Edit profile</SheetTitle>
                </SheetHeader>
                <TitleFilter
                    isModal
                    onSubmit={() => {
                        if (pathname === "/search") {
                            setOpen(false);
                        }
                    }}
                />
            </SheetContent>
        </Sheet >
    )
}