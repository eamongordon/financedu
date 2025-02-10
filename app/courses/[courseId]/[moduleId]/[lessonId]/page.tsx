import { getLessonWithActivities, getModuleWithLessonsAndActivities } from "@/lib/actions";

export default async function CourseLayout({
    params,
}: {
    params: Promise<{ lessonId: string }>,
}) {
    const lessonId = (await params).lessonId;
    const lesson = await getLessonWithActivities(lessonId);

    return (
        <p>Lesson: {lesson.title}</p>
    );
}