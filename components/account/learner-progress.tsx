"use client";

import { CompletionIcon } from "../ui/completion-icon";
import { FileText, CircleHelp } from "lucide-react";

interface CompletedActivity {
    activity: {
        id: string;
        title: string;
        type: string;
    };
    lesson: {
        id: string;
        title: string;
    };
    module: {
        id: string;
        title: string;
    };
    course: {
        id: string;
        title: string;
    };
}

interface UserProgressProps {
    completedActivities: CompletedActivity[];
}

export function UserProgress({ completedActivities }: UserProgressProps) {
    return (
        <nav className="flex flex-col divide-y border-t border-b w-full">
            {completedActivities.map(({ activity, lesson, module, course }) => (
                <div key={activity.id} className="flex items-center py-4 px-2 md:px-8">
                    <CompletionIcon
                        isComplete={true}
                        icon={activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
                    />
                    <div className="flex flex-col ml-4">
                        <span className="font-semibold">{activity.title}</span>
                        <span className="text-sm text-muted-foreground">{lesson.title} / {module.title} / {course.title}</span>
                    </div>
                </div>
            ))}
        </nav>
    );
}
