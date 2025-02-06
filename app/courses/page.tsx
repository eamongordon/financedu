import { listCourses } from "@/lib/actions";
import Banner from "@/components/banner";

export default async function CoursesPage() {
    const courses = await listCourses();

    return (
        <div>
            <Banner title="Courses"/>
            <ul>
                {courses.map((course) => (
                    <li key={course.id}>
                        <h2>{course.title}</h2>
                        <p>{course.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
