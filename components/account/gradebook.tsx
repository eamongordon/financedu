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
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Check, CircleHelp, FileText } from "lucide-react";

interface GradebookProps {
    students: StudentItem[],
    assignments: AssignmentItem[]
}

type StudentAssignmentsItem = {
    activityId: string;
    completed: boolean;
    accuracy?: number;
};

export type StudentItem = {
    studentName: string;
    assignments: StudentAssignmentsItem[];
}

export type AssignmentItem = {
    assignmentId: string;
    activityId: string;
    activityName: string;
    activityType: string;
}

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
                    placeholder="Filter by Student..."
                    value={(table.getColumn("studentName")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("studentName")?.setFilterValue(event.target.value)
                    }
                    className="w-full"
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

export function Gradebook({ students, assignments }: GradebookProps) {
    //todo: create permanent type definition
    type TempRowDefinition = {
        original: {
            assignments: StudentAssignmentsItem[];
        }
    }
    const columns = [
        {
            accessorKey: "studentName",
            header: "Student",
        },
        ...assignments.map((assignment) => {
            return {
                accessorKey: assignment.assignmentId,
                header: () => (
                    <div className="flex items-center flex-col gap-2 py-2">
                        {assignment.activityType === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                        <span>{assignment.activityName}</span>
                    </div>
                ),
                cell: ({ row }: { row: TempRowDefinition }) => {
                    const studentCompletion: StudentAssignmentsItem | undefined = row.original.assignments.find((studentAssignment: StudentAssignmentsItem) => studentAssignment.activityId === assignment.activityId);
                    const isArticle = studentCompletion && assignment.activityType === "Article";
                    const isComplete = studentCompletion && studentCompletion.completed;
                    const display = isArticle ? (isComplete ? <Check /> : null) : (isComplete ? studentCompletion.accuracy : null);
                    return (
                        <div className="flex items-center justify-center">
                            <Button variant="outline" className="size-[38px]">
                                {display}
                            </Button>
                        </div>
                    );
                },
            }
        })
    ];
    return (
        <DataTable columns={columns} data={students} />
    );
}
