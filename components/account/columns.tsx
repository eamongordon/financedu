import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link";
import { CompletionIcon } from "../ui/completion-icon";
import { CircleHelp, FileText } from "lucide-react";

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
    id: string
    name: string
    type: string
    lessonTitle: string;
    lessonId: string;
    moduleId: string;
    courseId: string;
    completedAt: Date
}

export const columns: ColumnDef<CompletedActivityItem>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.getValue("name");
            const lessonTitle = row.original.lessonTitle;
            const type = row.original.type;

            return (
                <Link
                    href={`/courses/${row.original.courseId}/${row.original.moduleId}/${row.original.lessonId}/${row.original.id}`}
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
        accessorKey: "type",
        header: "Type"
    }, {
        accessorKey: "lessonTitle",
        header: "Lesson"
    }
]