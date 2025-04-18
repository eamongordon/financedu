import { type getClassStudent } from "@/lib/fetchers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table";
import { FileText, CircleHelp, CircleCheckBig } from "lucide-react";
import { CompletionIcon } from "../../ui/completion-icon";
import { Button } from "../../ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

type Assignments = Awaited<ReturnType<typeof getClassStudent>>["assignments"];

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

function AssignmentsTable({ assignments }: { assignments: Assignments }) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Due</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {assignments.map((assignment) => (
                    <Link href={`/courses/${assignment.activity.lesson.module.course.slug}/${assignment.activity.lesson.module.slug}/${assignment.activity.lesson.slug}/${assignment.activity.slug}`} key={assignment.id} legacyBehavior>
                        <TableRow>
                            <TableCell className="flex flex-row items-center gap-4">
                                <CompletionIcon
                                    isComplete={false}
                                    icon={assignment.activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                                />
                                <div className="flex flex-col gap-2">
                                    <p className="leading-none text-base font-semibold">{assignment.activity.title as string}</p>
                                    <p className="leading-none">{assignment.activity.type as string}</p>
                                </div>
                            </TableCell>
                            <TableCell>
                                <p className="text-secondary">{formatDate(assignment.dueAt)}</p>
                            </TableCell>
                            <TableCell>
                                <Button>
                                    Get Started
                                </Button>
                            </TableCell>
                        </TableRow>
                    </Link>
                ))}
            </TableBody>
        </Table>
    );
}

export function AssignmentsStudentList({ assignments }: { assignments: Assignments }) {
    const currentAssignments = assignments.filter(assignment => new Date(assignment.dueAt) >= new Date());
    const pastAssignments = assignments.filter(assignment => new Date(assignment.dueAt) < new Date());

    return (
        <Tabs defaultValue="current" className="py-6">
            <TabsList className="bg-inherit gap-7">
                <TabsTrigger
                    value="current"
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Current
                </TabsTrigger>
                <TabsTrigger
                    value="past"
                    className="px-0 rounded-none text-md text-foreground font-semibold data-[state=active]:shadow-none data-[state=active]:text-primary border-b-4 border-transparent data-[state=active]:border-primary"
                >
                    Past
                </TabsTrigger>
            </TabsList>
            <TabsContent value="current" className="py-4">
                {currentAssignments.length > 0 ? (
                    <AssignmentsTable assignments={currentAssignments} />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 my-6">
                        <CircleCheckBig strokeWidth={1.5} />
                        <p className="text-lg font-semibold">
                            You&apos;re all set for now!
                        </p>
                        <p className="text-muted-foreground leading-none">Check back later for more assignments.</p>
                    </div>
                )}
            </TabsContent>
            <TabsContent value="past" className="py-4">
                {pastAssignments.length > 0 ? (
                    <AssignmentsTable assignments={pastAssignments} />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-3 my-6">
                        <p className="text-lg font-semibold">
                            No assignments found.
                        </p>
                        <p className="text-muted-foreground leading-none">They will appear here once you&apos;ve completed them.</p>
                    </div>
                )}
            </TabsContent>
        </Tabs>
    )
}