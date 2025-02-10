export default async function CourseLayout({
    params,
}: {
    params: Promise<{ moduleId: string }>,
}) {
    const moduleId = (await params).moduleId;
    return (
        <div>
            {moduleId}
        </div>
    );
}