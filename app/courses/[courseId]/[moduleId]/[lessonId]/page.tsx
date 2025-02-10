import { getLessonWithActivities } from "@/lib/actions";

export default async function LessonPage({
    params,
}: {
    params: Promise<{ lessonId: string }>,
}) {
    const lessonId = (await params).lessonId;
    const lesson = await getLessonWithActivities(lessonId);

    return (
        <p>Viewing Lesson Overview: {lesson.title}</p>
    );
}