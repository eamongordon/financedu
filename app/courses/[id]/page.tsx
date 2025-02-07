import { getCourse } from "@/lib/actions"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const slug = (await params).id;
    const course = await getCourse(slug, { includeModules: true, includeLessons: true });
    console.log("course", course);
    return (
        <div
            className="my-4 w-full mx-6 flex flex-col sm:flex-row sm:flex-grow sm:divide-x dark:divide-stone-500"
        >
            <div
                className="sm:w-1/3 flex flex-col gap-4 items-start px-2 sm:px-8 text-left sm:sticky top-[80px] mb-4 sm:mb-0 sm:h-screen"
            >
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="mt-2">{course.description}</p>
                {/* Add more course info as needed */}
            </div>
            <div
                className="sm:w-2/3 flex flex-col items-center mx-auto px-2 sm:px-8 overflow-auto"
            >
                {course.modules.map(module => (
                    <div key={module.id} className="mb-4">
                        <h2 className="text-xl font-semibold">{module.description}</h2>
                        <ul className="list-disc list-inside">
                            {module.lessons.map(lesson => (
                                <li key={lesson.id}>{lesson.description}</li>
                            ))}
                        </ul>
                        <div className="bg-purple-700 h-[2000px]"/>
                    </div>
                ))}
            </div>
        </div >
    );
}