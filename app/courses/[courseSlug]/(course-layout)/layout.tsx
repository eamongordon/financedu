import { getCourseWithModulesAndLessons, getCourseWithModulesAndLessonsAndUserCompletion } from "@/lib/fetchers"
import { ModuleNav } from "@/components/course/module-nav"
import { CourseHeader } from "@/components/course/course-header";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";

type courseWithModulesAndLessonsAndUserCompletion = Awaited<ReturnType<typeof getCourseWithModulesAndLessonsAndUserCompletion>>;

export default async function CourseLayout({
    params,
    children,
}: {
    params: Promise<{ courseSlug: string }>,
    children: React.ReactNode
}) {
    const slug = (await params).courseSlug;

    const session = await auth();

    const isLoggedIn = session && session.user && session.user.id;
    const course = isLoggedIn
        ? await getCourseWithModulesAndLessonsAndUserCompletion(slug)
        : await getCourseWithModulesAndLessons(slug);

    if (!course) return notFound();

    return (
        <div
            className="w-full flex flex-col sm:flex-row sm:flex-grow sm:divide-x divide"
        >
            <div
                className="sm:w-1/3 flex flex-col items-start text-left sm:sticky top-[64px] sm:h-[calc(100vh-64px)] overflow-auto"//todo: figure out proper height for scolling
            >
                <CourseHeader course={course} />
                <ModuleNav modules={course.modules.map(module => ({
                    slug: module.slug,
                    title: module.title,
                    icon: module.icon,
                    href: `/courses/${slug}/${module.slug}`,
                    isComplete: isLoggedIn ? (module as NonNullable<courseWithModulesAndLessonsAndUserCompletion>["modules"][number]).lessons.every(lesson => lesson.activities.every(activity => activity.userCompletion.length > 0)) : false
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