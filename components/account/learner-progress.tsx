"use client";

import { columns } from "./columns"
import { DataTable } from "./data-table"

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
    completedAt: Date;
}


interface UserProgressProps {
    completedActivities: CompletedActivity[];
}

export function UserProgress({ completedActivities }: UserProgressProps) {
    const data = completedActivities.map((completedActivityObj) => (
        {
            id: completedActivityObj.activity.id,
            name: completedActivityObj.activity.title,
            type: completedActivityObj.activity.type,
            lessonTitle: completedActivityObj.lesson.title,
            lessonId: completedActivityObj.lesson.id,
            moduleId: completedActivityObj.module.id,
            courseId: completedActivityObj.course.id,
            completedAt: completedActivityObj.completedAt,
        }
    ));
    return (
        <nav className="flex flex-col divide-y border-t border-b w-full">
            <DataTable columns={columns} data={data} />
        </nav>
    );
}
