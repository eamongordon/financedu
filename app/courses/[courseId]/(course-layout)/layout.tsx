import { getCourseWithModulesAndLessons, getCourseWithModulesAndLessonsAndUserCompletion } from "@/lib/actions"
import { ModuleNav } from "@/components/course/module-nav"
import { CourseHeader } from "@/components/course/course-header";
import { auth } from "@/lib/auth";

type courseWithModulesAndLessonsAndUserCompletion = Awaited<ReturnType<typeof getCourseWithModulesAndLessonsAndUserCompletion>>;

export default async function CourseLayout({
    params,
    children,
}: {
    params: Promise<{ courseId: string }>,
    children: React.ReactNode
}) {
    const slug = (await params).courseId;

    const session = await auth();

    const isLoggedIn = session && session.user && session.user.id;
    const course = isLoggedIn
        ? await getCourseWithModulesAndLessonsAndUserCompletion(slug)
        : await getCourseWithModulesAndLessons(slug);

        console.log("courseM", course);
    return (
        <div
            className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide"
        >
            <div
                className="sm:w-1/3 flex flex-col items-start text-left sm:sticky top-[64px] sm:h-[calc(100vh-64px)] overflow-auto"//todo: figure out proper height for scolling
            >
                <CourseHeader course={course} />
                <ModuleNav modules={course.modules.map(module => ({
                    id: module.id,
                    title: module.title,
                    icon: module.icon,
                    href: `/courses/${slug}/${module.id}`,
                    isComplete: isLoggedIn ? (module as courseWithModulesAndLessonsAndUserCompletion["modules"][number]).lessons.every(lesson => lesson.activities.every(activity => activity.userCompletion.length > 0)) : false
                }))} />
            </div>
            <div
                className="sm:w-2/3 flex flex-col items-center mx-auto sm:px-8 overflow-auto"
            >
                {children}
            </div>
        </div >
    );
}