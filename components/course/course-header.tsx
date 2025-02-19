"use client";

import { getCourseWithModulesAndLessons } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import { useParams } from "next/navigation";

type getCourseWithModulesAndLessonsReturnType = Awaited<ReturnType<typeof getCourseWithModulesAndLessons>>;

export function CourseHeader({ course }: { course: getCourseWithModulesAndLessonsReturnType }) {
    const params = useParams<{ moduleId: string }>();
    const isOnModulePage = !!params?.moduleId;
    return (
        <Link
            href={`/courses/${course.id}`}
            className={cn(buttonVariants({ variant: "ghost" }), "w-full h-auto rounded-none py-4 border-l-4 border-l-transparent flex flex-row justify-start items-center gap-4 px-2 sm:px-6 border-b", isOnModulePage ? "border-l-transparent" : "sm:border-l-primary")}
        >
            <div className="relative">
                <div className="absolute rounded-lg inset-0 bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:brightness-[0.6]"></div>
                <Image src={course.image ?? "/homepage-banner.jpg"} alt={course.title} width={64} height={64} className="rounded-lg before:absolute before:inset-0 before:bg-black before:opacity-50 before:rounded-lg before:w-10 before:h-10 opacity-10 min-w-12" />
            </div>
            <div className="flex flex-col justify-center gap-2 whitespace-normal">
                <h1 className="leading-none text-xl font-bold">{course.title}</h1>
                <h4 className="leading-none font-semibold text-secondary">{course.modules.length} Module{course.modules.length === 1 ? "" : "s"}</h4>
            </div>
        </Link>
    )
}