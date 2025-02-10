import { getCourseWithModulesAndLessons } from "@/lib/actions"

export default async function Page({
    params,
}: {
    params: Promise<{ courseId: string }>
}) {
    const slug = (await params).courseId;
    const course = await getCourseWithModulesAndLessons(slug);
    console.log("course", course);
    return (
        <p>Course Overview</p>
    );
}