"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FileText, CircleHelp } from "lucide-react";
import Link from "next/link";
import { CompletionIcon } from "../ui/completion-icon";
import { type getUserCompletion } from "@/lib/actions";

type UserCompletion = Awaited<ReturnType<typeof getUserCompletion>>;

function calculateCompletionAndAccuracy(items: UserCompletion[number]["modules"][number]["lessons"][number]["lessonToActivities"]) {
    const totalItems = items.length;
    const completedItems = items.filter(item => item.activity.userCompletion.length > 0).length;
    const completedActivities = items.filter(item => item.activity.userCompletion.length > 0 && item.activity.userCompletion[0]?.correctAnswers !== null && item.activity.userCompletion[0]?.totalQuestions !== null);
    const totalAccuracy = completedActivities.reduce((acc, item) => acc + ((item.activity.userCompletion[0]?.correctAnswers || 0) / (item.activity.userCompletion[0]?.totalQuestions || 1)), 0);
    const averageAccuracy = completedActivities.length > 0 ? (totalAccuracy / completedActivities.length) * 100 : undefined
    const completion = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
    return { completion: Math.round(completion), averageAccuracy: averageAccuracy ? `${Math.round(averageAccuracy)}%` : "---" };
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

    const selectedCourseData = selectedCourse ? courses.find(course => course.id === selectedCourse) : null;
    const selectedModuleData = selectedModule ? selectedCourseData?.modules.find(module => module.id === selectedModule) : null;

    return (
        <section>
            {!selectedCourse && (
                <>
                    {courses.map((course) => {
                        const { completion, averageAccuracy } = calculateCompletionAndAccuracy(course.modules.flatMap(module => module.lessons.flatMap(lesson => lesson.lessonToActivities)));
                        return (
                            <Card key={course.id} className="mb-4" onClick={() => handleCourseClick(course.id)}>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">{course.title}</h2>
                                    <p>{course.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <p>Completion: {completion}%</p>
                                    <p>Average Accuracy: {averageAccuracy}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </>
            )}
            {selectedCourse && !selectedModule && selectedCourseData && (
                <>
                    <button onClick={() => setSelectedCourse(null)}>Back to Courses</button>
                    {selectedCourseData.modules.map((module) => {
                        const { completion, averageAccuracy } = calculateCompletionAndAccuracy(module.lessons.flatMap(lesson => lesson.lessonToActivities));
                        return (
                            <Card key={module.id} className="mb-4" onClick={() => handleModuleClick(module.id)}>
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">{module.title}</h2>
                                    <p>{module.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <p>Completion: {completion}%</p>
                                    <p>Average Accuracy: {averageAccuracy}</p>
                                </CardContent>
                            </Card>
                        );
                    })}
                </>
            )}
            {selectedModule && selectedModuleData && (
                <>
                    <button onClick={() => setSelectedModule(null)}>Back to Modules</button>
                    {selectedModuleData.lessons.map((lesson) => {
                        const { completion, averageAccuracy } = calculateCompletionAndAccuracy(lesson.lessonToActivities);
                        return (
                            <Card key={lesson.id} className="mb-4">
                                <CardHeader>
                                    <h2 className="text-xl font-semibold">{lesson.title}</h2>
                                    <p>{lesson.description}</p>
                                </CardHeader>
                                <CardContent>
                                    <p>Completion: {completion}%</p>
                                    <p>Average Accuracy: {averageAccuracy}</p>
                                    <div className="grid grid-cols-1 lg:grid-cols-2">
                                        {lesson.lessonToActivities.map((lessonToActivitiesObj) => (
                                            <Link
                                                key={lessonToActivitiesObj.activity.id}
                                                href={`/courses/${selectedCourse}/${selectedModule}/${lesson.id}/${lessonToActivitiesObj.activity.id}`}
                                                className={cn(
                                                    buttonVariants({ variant: "link" }),
                                                    "py-8 text-base text-foreground [&_svg]:size-4 whitespace-normal justify-start gap-6",
                                                )}
                                            >
                                                <CompletionIcon
                                                    isComplete={lessonToActivitiesObj.activity.userCompletion.length > 0}
                                                    icon={lessonToActivitiesObj.activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                                                />
                                                {lessonToActivitiesObj.activity.title}
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