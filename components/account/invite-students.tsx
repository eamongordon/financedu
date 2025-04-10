"use client";

import * as React from "react"

import { useMediaQuery } from "@/lib/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Plus } from "lucide-react"
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { toast } from "sonner";
import Link from "next/link";

export function InviteStudents({ classCode, isNoStudents }: { classCode: string; isNoStudents?: boolean }) {
    const [open, setOpen] = React.useState(false)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button
                        {...isNoStudents ? { variant: "outline" } : {}}
                        {...!isNoStudents ? { className: "w-full" } : {}}
                    >
                        <Plus />
                        Invite Students
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Invite Students</DialogTitle>
                    </DialogHeader>
                    <InviteBody classCode={classCode} />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Done
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    {...isNoStudents ? { variant: "outline" } : {}}
                    {...!isNoStudents ? { className: "w-full" } : {}}
                >
                    <Plus />
                    Add Students
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Invite Students</DrawerTitle>
                </DrawerHeader>
                <InviteBody className="px-4" classCode={classCode} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Done</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function InviteBody({ classCode, className }: { classCode: string; className?: string }) {
    const baseUrl = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
    const baseUrlDisplay = baseUrl?.replace(/^www\./, "");
    const inviteLink = `${baseUrl}/join/${classCode}`;
    const inviteLinkDisplay = `${baseUrlDisplay}/join/${classCode}`;
    const [copied, setCopied] = React.useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            toast.success("Link copied to clipboard.");
        } catch {
            toast.error("Failed to copy link to clipboard.");
        }
    };

    return (
        <div className={className}>
            <div className="flex flex-col gap-4">
                <Label className="text-base text-muted-foreground">Share this link with your students</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        type="text"
                        value={inviteLinkDisplay}
                        disabled
                    />
                    <Button onClick={copyToClipboard}>{copied ? "Copy Again" : "Copy Link"}</Button>
                </div>
            </div>
            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-muted"></div>
                <span className="flex-shrink mx-4 text-muted-foreground">OR</span>
                <div className="flex-grow border-t border-muted"></div>
            </div>
            <p className="text-muted-foreground">
                Have your students visit <Link href={inviteLink} target="_blank" className="text-secondary font-semibold">{inviteLinkDisplay}</Link> and enter your class code: <span className="font-semibold text-foreground">{classCode}</span>.
            </p>
        </div>
    );
}