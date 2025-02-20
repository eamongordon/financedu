"use client";

import { useEffect, useState } from "react";
import { getCompletedActivities } from "@/lib/actions";
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

export function UserProgress() {
    const [completedActivities, setCompletedActivities] = useState<CompletedActivity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCompletedActivities() {
            try {
                const activities = await getCompletedActivities();
                setCompletedActivities(activities);
            } catch (error) {
                console.error("Failed to fetch completed activities", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCompletedActivities();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

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
