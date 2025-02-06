import { listCourses } from "@/lib/actions";

export default async function CoursesPage() {
    const courses = await listCourses();

    return (
        <div>
            <h1>Courses</h1>
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
