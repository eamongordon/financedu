import { listCourses } from "@/lib/actions";
import Banner from "@/components/banner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function CoursesPage() {
    const courses = await listCourses();

    return (
        <div>
            <Banner title="Courses" />
            <ul className="flex justify-center items-center flex-wrap gap-4 my-10">
                {courses.map((course) => (
                    <li key={course.id}>
                        <Card className="w-[300px] sm:w-[375px] rounded-lg">
                            <div className="relative w-full h-48">
                                <Image src={"/homepage-banner.jpg"} alt={course.title} layout="fill" className="object-cover rounded-t-lg" />
                            </div>
                            <CardHeader>
                                <CardTitle>{course.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-6">
                                <p>{course.description}</p>
                                <div className="flex gap-10 sm:gap-12">
                                    <div>
                                        <p className="font-semibold">Length (Hrs.):</p>
                                        <p className="text-2xl">32 - 56</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Grade Levels:</p>
                                        <p className="text-2xl">7 - 12</p>
                                    </div>
                                </div>
                                <Link href={`/courses/${course.id}`} className={cn(buttonVariants(), "w-full")}>View Course</Link>
                            </CardContent>
                        </Card>
                    </li>
                ))}
            </ul>
        </div>
    );
}
