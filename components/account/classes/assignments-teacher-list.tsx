"use client";

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"
import Link from "next/link";
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { CompletionIcon } from "../../ui/completion-icon";
import { CircleHelp, FileText, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { deleteAssignment } from "@/lib/actions/classes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type CreateAssignments } from "@/components/account/classes/create-assigments"; // Adjust the import path as necessary
import { EditAssignment } from "./edit-assignment";

interface UserProgressProps {
    assignments: AssignmentItem[];
    createAssignmentsElem: React.ReactElement<typeof CreateAssignments>;
}

function formatDate(date: Date) {
    const options: Intl.DateTimeFormatOptions = {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    };
    return new Intl.DateTimeFormat('en-US', options).format(date).replace(',', ' at');
}

export type AssignmentItem = {
    assignmentId: string;
    courseSlug: string;
    moduleSlug: string;
    lessonSlug: string;
    activitySlug: string;
    activityTitle: string;
    activityType: string;
    dueDate: Date;
    startDate: Date;
};

function DataTable<TData, TValue>({
    columns,
    data,
    createAssignmentsElem,
}: {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    createAssignmentsElem?: React.ReactElement<typeof CreateAssignments>;
}) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters
        },
    });

    return (
        <div>
            <div className="flex flex-wrap items-center py-4 gap-4">
                <Input
                    placeholder="Filter by Assignment..."
                    value={(table.getColumn("activityTitle")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("activityTitle")?.setFilterValue(event.target.value)
                    }
                    className="w-full sm:flex-1"
                />
                <div className="w-full sm:w-auto">
                    {createAssignmentsElem}
                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center space-y-2">
                                    <h3 className="text-base font-semibold">No Results Found</h3>
                                    {data.length > 0 ? <p>Try adjusting your filters.</p> : <p>Once you complete an activity, it will show here.</p>}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}

export function AssignmentsTeacherList({ assignments, createAssignmentsElem }: UserProgressProps) {
    const router = useRouter();

    const assignmentColumns: ColumnDef<AssignmentItem>[] = [
        {
            accessorKey: "activityTitle",
            header: "Activity",
            cell: ({ row }) => {
                const title = row.getValue("activityTitle");
                const type = row.original.activityType;
                return (
                    <Link
                        href={`/courses/${row.original.courseSlug}/${row.original.moduleSlug}/${row.original.lessonSlug}/${row.original.activitySlug}`}
                        className="flex flex-row items-center gap-4"
                    >
                        <CompletionIcon
                            isComplete={false}
                            icon={type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                        />
                        <div className="flex flex-col gap-2">
                            <p className="leading-none font-semibold">{title as string}</p>
                            <p className="leading-none">{type as string}</p>
                        </div>
                    </Link>
                );
            },
        },
        {
            accessorKey: "startDate",
            header: "Start Date",
            cell: ({ row }) => {
                const formatted = formatDate(row.getValue("startDate"));
                return (
                    <p className="text-secondary">{formatted}</p>
                );
            },
        },
        {
            accessorKey: "dueDate",
            header: "Due Date",
            cell: ({ row }) => {
                const formatted = formatDate(row.getValue("dueDate"));
                return (
                    <p className="text-secondary">{formatted}</p>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const handleDelete = async () => {
                    const confirmed = window.confirm("Are you sure you want to delete this assignment?");
                    if (!confirmed) return;
                    await deleteAssignment(row.original.assignmentId);
                    toast.success("Assignment deleted");
                    router.refresh();
                };

                return (
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <EditAssignment
                                assignment={{
                                    id: row.original.assignmentId,
                                    startAt: row.original.startDate,
                                    dueAt: row.original.dueDate
                                }}
                            />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-destructive"
                                onClick={handleDelete}
                            >
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }
    ];

    return (
        <DataTable columns={assignmentColumns} data={assignments} createAssignmentsElem={createAssignmentsElem} />
    );
}
