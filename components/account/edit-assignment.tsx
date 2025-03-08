"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/lib/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { DueDateSetter, type DueDateSetterData } from "@/components/account/duedate-setter";
import { editAssignment } from "@/lib/actions";
import { toast } from "sonner";
import { DropdownMenuItem } from "../ui/dropdown-menu";

type EditAssignmentObj = {
    id: string;
    startAt: Date;
    dueAt: Date;
}

export function EditAssignment({ assignment }: { assignment: EditAssignmentObj }) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const router = useRouter();

    const handleDueDateSubmit = async (data: DueDateSetterData) => {
        await editAssignment(assignment.id, {
            startAt: data.startDate,
            dueAt: data.dueDate
        });
        toast.success("Assignment updated.");
        setOpen(false);
        router.refresh();
    };

    const initialData = {
        startAt: assignment.startAt,
        dueAt: assignment.dueAt
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Assignment</DialogTitle>
                        <DialogDescription>Update the start and due dates for the assignment.</DialogDescription>
                    </DialogHeader>
                    <DueDateSetter isEdit selectedActivities={[]} setOpen={setOpen} onSubmit={handleDueDateSubmit} initialData={initialData} />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit Assignment</DrawerTitle>
                    <DrawerDescription>Update the start and due dates for the assignment.</DrawerDescription>
                </DrawerHeader>
                <DueDateSetter isEdit selectedActivities={[]} isDrawer setOpen={setOpen} onSubmit={handleDueDateSubmit} initialData={initialData} />
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}