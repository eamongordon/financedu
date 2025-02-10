import { getCourseWithModulesAndLessons } from "@/lib/actions"
import { ModuleNav } from "@/components/course/module-nav"

export default async function CourseLayout({
    params,
    children,
}: {
    params: Promise<{ courseId: string }>,
    children: React.ReactNode
}) {
    const slug = (await params).courseId;
    const course = await getCourseWithModulesAndLessons(slug);
    console.log("course", course);
    return (
        <div
            className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide-muted"
        >
            <div
                className="py-4 sm:w-1/3 flex flex-col gap-4 items-start px-2 sm:px-8 text-left sm:sticky top-[64px] mb-4 sm:mb-0 sm:h-[calc(100vh-64px)] overflow-auto"//todo: figure out proper height for scolling
            >
                <h1 className="text-2xl font-bold">{course.title}</h1>
                <p className="mt-2">{course.description}</p>
                <div className="flex flex-row gap-10 sm:gap-12">
                    <div>
                        <p className="font-semibold">Length (Hrs.):</p>
                        <p className="text-muted-foreground text-2xl">32 - 56</p>
                    </div>
                    <div>
                        <p className="font-semibold">Grade Levels:</p>
                        <p className="text-muted-foreground text-2xl">7 - 12</p>
                    </div>
                </div>
                <div>
                    <h2 className="text-xl font-bold">Modules</h2>
                    <ModuleNav modules={course.modules.map(module => ({
                        id: module.id,
                        title: module.title,
                        href: `/courses/${slug}/${module.id}`
                    }))} />
                </div>
            </div>
            <div
                className="py-4 sm:w-2/3 flex flex-col items-center mx-auto px-2 sm:px-8 overflow-auto"
            >
                {children}
            </div>
        </div >
    );
}