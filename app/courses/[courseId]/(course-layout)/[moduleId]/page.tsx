import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { getModuleWithLessonsAndActivities } from "@/lib/actions";
import Link from "next/link";

export default async function CourseLayout({
    params,
}: {
    params: Promise<{ moduleId: string }>,
}) {
    const moduleId = (await params).moduleId;
    const moduleObj = await getModuleWithLessonsAndActivities(moduleId);
    console.log("module", moduleObj);
    return (
        <div>
            {moduleObj.lessons.map(lesson => (
                <Card key={lesson.id} className="mb-4">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">{lesson.title}</h2>
                    </CardHeader>
                    <CardContent>
                        <p>{lesson.description}</p>
                        <p dangerouslySetInnerHTML={{ __html: lesson.objectives ?? "" }} />
                    </CardContent>
                    <CardFooter>
                        <Link className={buttonVariants()} href={`/courses/${moduleObj.courseId}/${moduleObj.id}/${lesson.id}`}>Get Started</Link>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}