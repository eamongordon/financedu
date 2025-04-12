import type { Metadata } from 'next';
import { listCourses } from "@/lib/fetchers";
import Banner from "@/components/banner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: 'Courses',
    description: 'Browse a collection of free, detailed, and interactive financial courses for youth, ranging from budgeting to investing.'
}

export default async function CoursesPage() {
    const courses = await listCourses();

    return (
        <div>
            <Banner title="Courses" />
            <ul className="flex justify-center items-center flex-wrap gap-4 my-4 sm:my-10 px-4">
                {courses.map((course) => (
                    <li key={course.id}>
                        <Card className="w-full sm:w-[375px] overflow-hidden">
                            <div className="relative w-full h-36">
                                <Image src={course.image ?? "/homepage-banner.jpg"} alt={course.title} layout="fill" className="object-cover" />
                            </div>
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">
                                <p className="text-muted-foreground">{course.description}</p>
                                <div className="flex gap-10 sm:gap-12">
                                    <div>
                                        <p className="font-semibold">Length (Hrs.):</p>
                                        <p className="text-muted-foreground text-2xl">32 - 56</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Grade Levels:</p>
                                        <p className="text-muted-foreground text-2xl">7 - 12</p>
                                    </div>
                                </div>
                                <Link href={`/courses/${course.slug}`} className={cn(buttonVariants(), "w-full")}>View Course</Link>
                            </CardContent>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
}
