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
import { CompletionIcon } from "../ui/completion-icon";
import { CircleHelp, FileText } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuPortal } from "../ui/dropdown-menu";
import { DateRange } from "react-day-picker";

interface UserProgressProps {
    completedActivities: CompletedActivityItem[];
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

export type CompletedActivityItem = {
    activityId: string;
    activityTitle: string
    activityType: string
    lessonTitle: string;
    lessonId: string;
    moduleId: string;
    courseId: string;
    completedAt: Date
}

const columns: ColumnDef<CompletedActivityItem>[] = [
    {
        accessorKey: "activityTitle",
        header: "Name",
        cell: ({ row }) => {
            const name = row.getValue("activityTitle");
            const lessonTitle = row.original.lessonTitle;
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
                        <p className="leading-none font-semibold">{name as string}</p>
                        <p className="leading-none">{lessonTitle as string}</p>
                    </div>
                </Link>
            );
        },
    },
    {
        accessorKey: "completedAt",
        header: "Completed",
        cell: ({ row }) => {
            const formatted = formatDate(row.getValue("completedAt"));
            return (
                <p className="text-secondary">{formatted}</p>
            );
        },
        filterFn: (row, columnId, filterValue) => {
            const rowDate = new Date(row.getValue(columnId));
            const [startDate, endDate] = filterValue;

            return rowDate >= new Date(startDate) && rowDate <= new Date(endDate);
        },
    }, {
        accessorKey: "activityType",
        header: "Type"
    }, {
        accessorKey: "lessonTitle",
        header: "Lesson"
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
    const [customRange, setCustomRange] = useState<DateRange | undefined>({
        from: new Date(0),
        to: new Date(),
    });
    const [selectedRange, setSelectedRange] = useState<string>("all");
    const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

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
        initialState: {
            columnVisibility: {
                activityType: false,
                lessonTitle: false,
            }
        },
    });

    const handleDateFilterChange = (value: string) => {
        setSelectedRange(value);
        let startDate: Date;
        let endDate: Date;

        switch (value) {
            case "today":
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0);
                endDate = new Date();
                endDate.setHours(23, 59, 59, 999);
                break;
            case "past7days":
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                endDate = new Date();
                break;
            case "past30days":
                startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                endDate = new Date();
                break;
            case "custom":
                if (customRange) {
                    startDate = customRange.from!;
                    endDate = customRange.to!;
                } else {
                    startDate = new Date(0);
                    endDate = new Date();
                }
                break;
            case "all":
            default:
                startDate = new Date(0); // Default to epoch if no filter
                endDate = new Date();
        }

        table.getColumn("completedAt")?.setFilterValue([startDate, endDate]);
    };

    const handleCustomRangeSelect = (range: DateRange | undefined) => {
        setCustomRange(range);
        if (range?.from && range?.to) {
            table.getColumn("completedAt")?.setFilterValue([range.from, range.to]);
            setIsDropdownOpen(false);
        }
    };

    return (
        <div>
            <div className="flex items-center py-4 gap-4">
                <Input
                    placeholder="Filter by Activity..."
                    value={(table.getColumn("activityTitle")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("activityTitle")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />

                <Select
                    onValueChange={(value) =>
                        table.getColumn("activityType")?.setFilterValue(value === "all" ? "" : value)
                    }
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="article">Articles</SelectItem>
                            <SelectItem value="quiz">Quizzes</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-[180px]">Select Date Range</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuRadioGroup value={selectedRange} onValueChange={handleDateFilterChange}>
                            <DropdownMenuRadioItem value="all">All Time</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="today">Today</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="past7days">Last Week</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="past30days">Last Month</DropdownMenuRadioItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    Custom Range
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <Calendar
                                            selected={customRange}
                                            mode="range"
                                            onSelect={(range) => {
                                                handleCustomRangeSelect(range);
                                                handleDateFilterChange("custom");
                                            }}
                                        />
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
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

export function UserProgress({ completedActivities }: UserProgressProps) {
    return (
        <DataTable columns={columns} data={completedActivities} />
    );
}
