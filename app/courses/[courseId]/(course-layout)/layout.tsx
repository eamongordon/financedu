import { getCourseWithModulesAndLessons } from "@/lib/actions"
import { ModuleNav } from "@/components/course/module-nav"
import { CourseHeader } from "@/components/course/course-header";

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
            className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide"
        >
            <div
                className="sm:w-1/3 flex flex-col items-start text-left sm:sticky top-[64px] mb-4 sm:mb-0 sm:h-[calc(100vh-64px)] overflow-auto"//todo: figure out proper height for scolling
            >
                <CourseHeader course={course}/>
                <ModuleNav modules={course.modules.map(module => ({
                    id: module.id,
                    title: module.title,
                    icon: module.icon,
                    href: `/courses/${slug}/${module.id}`
                }))} />
            </div>
            <div
                className="py-4 sm:w-2/3 flex flex-col items-center mx-auto px-2 sm:px-8 overflow-auto"
            >
                {children}
            </div>
        </div >
    );
}