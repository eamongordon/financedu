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
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { removeStudentFromClass } from "@/lib/actions/classes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { getInitials } from "@/lib/utils";
import { User } from "lucide-react";
import { InviteStudents } from "./invite-students";

export type StudentItem = {
    studentId: string;
    name: string;
    email: string;
    image?: string;
};

interface StudentsListProps {
    students: StudentItem[];
    inviteButtonElem: React.ReactElement<typeof InviteStudents>;
}

function DataTable<TData, TValue>({
    columns,
    data,
    inviteButtonElem
}: {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    inviteButtonElem: React.ReactElement<typeof InviteStudents>;
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
                    placeholder="Filter by Name..."
                    value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("name")?.setFilterValue(event.target.value)
                    }
                    className="w-full sm:flex-1"
                />
                <div className="w-full sm:w-auto">
                    {inviteButtonElem}
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

export function StudentsList({ students, inviteButtonElem }: StudentsListProps) {
    const router = useRouter();

    const studentColumns: ColumnDef<StudentItem>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => {
                const student = row.original;
                return (
                    <div className="flex items-center gap-4">
                        <Avatar className="size-12">
                            {student.image ? (
                                <AvatarImage src={student.image} alt={student.name} />
                            ) : null}
                            <AvatarFallback>
                                {getInitials(student.name) || <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <p className="font-semibold">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const handleRemove = async () => {
                    const confirmed = window.confirm("Are you sure you want to remove this student?");
                    if (!confirmed) return;
                    await removeStudentFromClass(row.original.studentId);
                    toast.success("Student removed");
                    router.refresh();
                };

                return (
                    <div className="flex justify-end">
                        <Button variant="ghost" className="text-destructive hover:text-destructive" onClick={handleRemove}>
                            Remove
                        </Button>
                    </div>
                );
            },
        }
    ];

    return (
        <DataTable columns={studentColumns} data={students} inviteButtonElem={inviteButtonElem} />
    );
}
