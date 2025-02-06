
import { getCourse } from "@/lib/actions"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const slug = (await params).id;
    const course = await getCourse(slug);
    console.log("course", course);
    return <div>My Post: {slug}</div>
}