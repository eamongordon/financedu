import { getClassTeacher } from "@/lib/actions";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const classId = (await params).classId;
    const classItem = await getClassTeacher(classId);
    return (
        <>{classItem.name}</>
    );
}