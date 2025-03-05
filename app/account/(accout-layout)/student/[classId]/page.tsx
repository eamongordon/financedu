import { getClassStudent } from "@/lib/actions";

export default async function Page({
    params,
}: {
    params: Promise<{ classId: string }>
}) {
    const childId = (await params).classId;
    const classItem = await getClassStudent(childId);
    return (
        <section>
            {classItem.id}
        </section>
    );
}