import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { getModuleWithLessonsAndActivities } from "@/lib/actions";

export default async function CourseLayout({
    params,
}: {
    params: Promise<{ moduleId: string }>,
}) {
    const moduleId = (await params).moduleId;
    const module = await getModuleWithLessonsAndActivities(moduleId);
    console.log("module", module);
    return (
        <div>
            {module.lessons.map(lesson => (
                <Card key={lesson.id} className="mb-4">
                    <CardHeader>
                        <h2 className="text-xl font-semibold">{lesson.title}</h2>
                    </CardHeader>
                    <CardContent>
                        <p>{lesson.description}</p>
                        <p dangerouslySetInnerHTML={{ __html: lesson.objectives ?? "" }} />
                    </CardContent>
                    <CardFooter>
                        <Button>Get Started</Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}