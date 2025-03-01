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
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { CompletionIcon } from "../ui/completion-icon";
import { CircleHelp, FileText, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";

interface UserProgressProps {
    assignments: AssignmentItem[];
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
    courseId: string;
    moduleId: string;
    lessonId: string;
    activityId: string;
    activityTitle: string;
    activityType: string;
    dueDate: Date;
    startDate: Date;
};

const assignmentColumns: ColumnDef<AssignmentItem>[] = [
    {
        accessorKey: "activityTitle",
        header: "Activity",
        cell: ({ row }) => {
            const title = row.getValue("activityTitle");
            const type = row.original.activityType;
            return (
                <Link
                    href={`/courses/${row.original.courseId}/${row.original.moduleId}/${row.original.lessonId}/${row.original.activityId}`}
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
        id: "actions",
        enableHiding: false,
        cell: () => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive"
                        >Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    }
];

function DataTable<TData, TValue>({
    columns,
    data,
}: {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
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
                    className="w-full sm:w-1/2"
                />
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
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
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

export function AssignmentsTeacherList({ assignments }: UserProgressProps) {
    return (
        <DataTable columns={assignmentColumns} data={assignments} />
    );
}
