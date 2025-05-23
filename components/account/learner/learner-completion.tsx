"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, CircleHelp, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { CompletionIcon } from "../../ui/completion-icon";
import { Progress } from "../../ui/progress";
import { type getUserCompletion } from "@/lib/fetchers";

type UserCompletion = Awaited<ReturnType<typeof getUserCompletion>>;

function formatDate(date: Date) {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function calculateCompletionAndAccuracy(items: UserCompletion[number]["modules"][number]["lessons"][number]["activities"]) {
    const totalItems = items.length;
    const completedItems = items.filter(item => item.userCompletion.length > 0).length;
    const completedActivities = items.filter(item => item.userCompletion.length > 0 && item.userCompletion[0]?.correctAnswers !== null && item.userCompletion[0]?.totalQuestions !== null);
    const totalAccuracy = completedActivities.reduce((acc, item) => acc + ((item.userCompletion[0]?.correctAnswers || 0) / (item.userCompletion[0]?.totalQuestions || 1)), 0);
    const averageAccuracy = completedActivities.length > 0 ? (totalAccuracy / completedActivities.length) * 100 : undefined;
    const completion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    const lastCompletedActivity = items.reduce<Date | null>((latest, item) => {
        const completedAt = item.userCompletion[0]?.completedAt;
        return completedAt && (!latest || new Date(completedAt) > new Date(latest)) ? completedAt : latest;
    }, null);
    const completionDate = completedItems === totalItems && lastCompletedActivity ? formatDate(new Date(lastCompletedActivity)) : "In Progress";
    return { completion: Math.round(completion), averageAccuracy: averageAccuracy ? `${Math.round(averageAccuracy)}%` : "---", completionDate };
}

export function LearnerCompletion({ courses }: { courses: UserCompletion }) {
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedModule, setSelectedModule] = useState<string | null>(null);

    const handleCourseClick = (courseId: string) => {
        setSelectedCourse(courseId);
        setSelectedModule(null);
    };

    const handleModuleClick = (moduleId: string) => {
        setSelectedModule(moduleId);
    };

    const selectedCourseData = selectedCourse ? courses.find(course => course.slug === selectedCourse) : null;
    const selectedModuleData = selectedModule ? selectedCourseData?.modules.find(module => module.slug === selectedModule) : null;

    return (
        <section>
            {!selectedCourse && (
                <>
                    {courses.map((course) => {
                        const { completion, averageAccuracy, completionDate } = calculateCompletionAndAccuracy(course.modules.flatMap(module => module.lessons.flatMap(lesson => lesson.activities)));
                        return (
                            <Card key={course.id} className="mb-4 cursor-pointer" onClick={() => handleCourseClick(course.slug)}>
                                <CardHeader>
                                    <Link
                                        href={`/courses/${course.slug}`}
                                        target="_blank"
                                        className={cn(buttonVariants({ variant: "link" }), "text-card-foreground block p-0")}
                                    >
                                        <h2 className="text-xl font-semibold">{course.title}</h2>
                                    </Link>
                                    <p>{course.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-row gap-4 sm:gap-8 lg:gap-12">
                                        <div className="space-y-2 grow">
                                            <p className="font-semibold">Completion: {completion}%</p>
                                            <Progress value={completion} className="bg-secondary/40" />
                                        </div>
                                        <div className="flex sm:shrink-0 gap-4 sm:gap-8 lg:gap-12">
                                            <div>
                                                <p className="font-semibold">Avg. Accuracy</p>
                                                <p className="text-muted-foreground font-semibold">{averageAccuracy}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Date Completed:</p>
                                                <p className="text-muted-foreground font-semibold">{completionDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </>
            )}
            {selectedCourse && !selectedModule && selectedCourseData && (
                <>
                    <Button
                        onClick={() => setSelectedCourse(null)}
                        className="my-2 text-secondary justify-start px-0 text-base"
                        variant="link"
                    >
                        <ChevronLeft />
                        Back to Course
                    </Button>
                    {selectedCourseData.modules.map((module) => {
                        const { completion, averageAccuracy, completionDate } = calculateCompletionAndAccuracy(module.lessons.flatMap(lesson => lesson.activities));
                        return (
                            <Card key={module.id} className="mb-4 cursor-pointer" onClick={() => handleModuleClick(module.slug)}>
                                <CardHeader>
                                    <Link
                                        href={`/courses/${selectedCourse}/${module.slug}`}
                                        target="_blank"
                                        className={cn(cn(buttonVariants({ variant: "link" }), "text-card-foreground block p-0"))}
                                    >
                                        <h2 className="text-xl font-semibold">{module.title}</h2>
                                    </Link>
                                    <p>{module.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-row gap-8 lg:gap-12">
                                        <div className="space-y-2 grow">
                                            <p className="font-semibold">Completion: {completion}%</p>
                                            <Progress value={completion} className="bg-secondary/40" />
                                        </div>
                                        <div className="flex shrink-0 gap-8 lg:gap-12">
                                            <div>
                                                <p className="font-semibold">Avg. Accuracy</p>
                                                <p className="text-muted-foreground font-semibold">{averageAccuracy}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Date Completed:</p>
                                                <p className="text-muted-foreground font-semibold">{completionDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </>
            )}
            {selectedModule && selectedModuleData && (
                <>
                    <Button
                        onClick={() => setSelectedCourse(null)}
                        className="my-2 text-secondary justify-start px-0 text-base"
                        variant="link"
                    >
                        <ChevronLeft />
                        Back to Modules
                    </Button>
                    {selectedModuleData.lessons.map((lesson) => {
                        const { completion, averageAccuracy, completionDate } = calculateCompletionAndAccuracy(lesson.activities);
                        return (
                            <Card key={lesson.id} className="mb-4">
                                <CardHeader>
                                    <Link
                                        href={`/courses/${selectedCourse}/${selectedModule}/${lesson.slug}/${lesson.activities[0].slug}`}
                                        target="_blank"
                                        className={cn(buttonVariants({ variant: "link" }), "text-card-foreground block p-0")}
                                    >
                                        <h2 className="text-xl font-semibold">{lesson.title}</h2>
                                    </Link>
                                    <p>{lesson.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-row gap-8 lg:gap-12 border-b pb-8">
                                        <div className="space-y-2 grow">
                                            <p className="font-semibold">Completion: {completion}%</p>
                                            <Progress value={completion} className="bg-secondary/40" />
                                        </div>
                                        <div className="flex shrink-0 gap-8 lg:gap-12">
                                            <div>
                                                <p className="font-semibold">Avg. Accuracy</p>
                                                <p className="text-muted-foreground font-semibold">{averageAccuracy}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Date Completed:</p>
                                                <p className="text-muted-foreground font-semibold">{completionDate}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-4 grid grid-cols-1 lg:grid-cols-2">
                                        {lesson.activities.map((activity) => (
                                            <Link
                                                key={activity.id}
                                                href={`/courses/${selectedCourse}/${selectedModule}/${lesson.slug}/${activity.slug}`}
                                                className={cn(
                                                    buttonVariants({ variant: "link" }),
                                                    "py-8 text-base text-foreground [&_svg]:size-4 whitespace-normal justify-start gap-6",
                                                )}
                                            >
                                                <CompletionIcon
                                                    isComplete={activity.userCompletion.length > 0}
                                                    icon={activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                                                />
                                                {activity.title}
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </>
            )}
        </section>
    );
}