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
import { cn } from "@/lib/utils";

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
                                        <TableHead key={header.id} className={header.column.id === "studentName" ? "sticky left-0 bg-background rounded-tl-md" : ""}>
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
                                        <TableCell key={cell.id} className={cell.column.id === "studentName" ? "sticky left-0 bg-background rounded-bl-md" : ""}>
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

    const getAccuracyColor = (accuracy?: number) => {
        if (accuracy === undefined) return "";
        if (accuracy === 100) return "bg-primary/30 border-primary/30";
        if (accuracy >= 75) return "bg-yellow-300/30 dark:bg-yellow-300/30 border-yellow-500/30 dark:border-yellow-500/30"; // Use yellow for high accuracy
        if (accuracy >= 50) return "bg-orange-300/30 dark:bg-orange-300/30 border-orange-500/30 dark:border-orange-500/30"; // Use orange for medium accuracy
        return "bg-destructive/30 border-destructive/30"; // Use red for low accuracy
    };

    const columns = [
        {
            accessorKey: "studentName",
            header: "Student",
        },
        ...assignments.map((assignment) => {
            return {
                accessorKey: assignment.assignmentId,
                header: () => (
                    <div className="flex items-center flex-col gap-2 py-2 text-center">
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
                            <Button variant="outline" className={cn("size-[38px]", isArticle && isComplete ? "bg-primary/30 border-primary/30" : getAccuracyColor(studentCompletion?.accuracy))}>
                                {display}
                            </Button>
                        </div>
                    );
                },
            }
        })
    ];
    return !students.length ? (
        <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-lg font-semibold mt-6">
                You haven&apos;t added any students yet. Once you add students and create assignments, their scores will appear here.
            </p>
        </div>
    ) : !assignments.length ? (
        <div className="flex flex-col items-center justify-center mt-6">
            <p className="text-lg font-semibold mt-6">
                You haven&apos;t created any assignments yet.
            </p>
            <p>Your gradebook will show scores once you create at least one.</p>
        </div>
    ) : (
        <DataTable columns={columns} data={students} />
    )
}
