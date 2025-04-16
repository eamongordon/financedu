import type { Metadata } from 'next';
import { listCourses } from "@/lib/fetchers";
import Banner from "@/components/banner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CloudsDarkClass, CloudsLightClass } from "@/components/illustrations/clouds";

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
            <div className="flex flex-col ml-8 gap-2 py-6">
                <h3 className="text-2xl md:text-3xl font-semibold">Why Financedu?</h3>
                <h4 className="text-xl font-semibold text-muted-foreground">Our courses are..</h4>
            </div>
            <div className="space-y-4">
                <div className={`dark:hidden h-12 w-full bg-repeat-x ${CloudsLightClass}`} />
                <div className={`hidden dark:block h-12 w-full bg-repeat-x ${CloudsDarkClass}`} />
            </div>
            <div className="flex flex-col py-6 md:py-0">
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                    <div className="md:w-1/3 flex justify-center items-center">
                        <div className="h-24 md:h-32 fill-secondary">
                            <TouchIllustration />
                        </div>
                    </div>
                    <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                        <div className="md:w-4/5">
                            <h1 className="text-2xl font-bold mb-4">Interactive</h1>
                            <p className="text-lg text-muted-foreground">Students will explore finance through interactive tools that harness the power of modern technology.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                    <div className="md:w-1/3 flex justify-center items-center">
                        <div className="h-24 md:h-32 fill-secondary">
                            <LightbulbIllustration />
                        </div>
                    </div>
                    <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                        <div className="md:w-4/5">
                            <h1 className="text-2xl font-bold mb-4">Applicable to Real Life</h1>
                            <p className="text-lg text-muted-foreground">Learners explore financial topics through real-life scenarios, such as budgeting, goal-setting, and simulations.</p>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 md:gap-0 md:flex-row items-center justify-between">
                    <div className="md:w-1/3 flex justify-center items-center">
                        <div className="h-20 md:h-28 fill-secondary">
                            <BookIllustration />
                        </div>
                    </div>
                    <div className="md:w-2/3 flex items-center justify-center md:bg-muted/60 py-6 md:pt-12 md:pb-8 px-4">
                        <div className="md:w-4/5">
                            <h1 className="text-2xl font-bold mb-4">Standards-Based</h1>
                            <p className="text-lg text-muted-foreground">Our courses are based on recognized state and national standards, ensuring that our courses address all areas of financial education.</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}


function TouchIllustration() {
    return (
        <svg preserveAspectRatio="xMidYMid meet" data-bbox="59.5 31 81 138" viewBox="59.5 31 81 138" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path d="M90.946 91.399c16.655 0 30.155-13.229 30.155-29.55 0-16.319-13.5-29.548-30.155-29.548S60.791 45.529 60.791 61.848c0 16.322 13.5 29.551 30.155 29.551" className="fill-muted"></path>
                <path d="M90.945 92.699c-17.338 0-31.445-13.84-31.445-30.85S73.607 31 90.945 31c17.34 0 31.447 13.838 31.447 30.848s-14.106 30.851-31.447 30.851zm0-59.1c-15.914 0-28.861 12.673-28.861 28.25 0 15.578 12.947 28.252 28.861 28.252 15.916 0 28.863-12.673 28.863-28.252.001-15.577-12.947-28.25-28.863-28.25z" className="fill-secondary"></path>
                <path d="M90.946 83.962c12.468 0 22.575-9.9 22.575-22.112 0-12.214-10.107-22.114-22.575-22.114s-22.575 9.9-22.575 22.114c0 12.212 10.107 22.112 22.575 22.112" className="fill-background"></path>
                <path d="M90.945 85.261c-13.16 0-23.867-10.502-23.867-23.411s10.708-23.413 23.867-23.413 23.867 10.504 23.867 23.413-10.707 23.411-23.867 23.411zm0-44.225c-11.735 0-21.283 9.337-21.283 20.814 0 11.475 9.548 20.812 21.283 20.812s21.283-9.337 21.283-20.812c0-11.476-9.547-20.814-21.283-20.814z" className="fill-secondary"></path>
                <path d="M90.946 76.525c8.281 0 14.993-6.57 14.993-14.675 0-8.107-6.712-14.677-14.993-14.677s-14.993 6.57-14.993 14.677c0 8.105 6.712 14.675 14.993 14.675" className="fill-muted"></path>
                <path d="M90.945 77.825c-8.979 0-16.285-7.166-16.285-15.975s7.306-15.977 16.285-15.977c8.981 0 16.287 7.168 16.287 15.977s-7.306 15.975-16.287 15.975zm0-29.353c-7.554 0-13.7 6.001-13.7 13.378 0 7.375 6.146 13.376 13.7 13.376 7.556 0 13.702-6.001 13.702-13.376.001-7.377-6.145-13.378-13.702-13.378z" className="fill-secondary"></path>
                <path d="M139.207 144.614v-35.248c0-3.827-3.175-6.929-7.092-6.929-3.278 0-5.914 2.22-6.726 5.172v-2.661c0-3.827-3.175-6.929-7.092-6.929-3.278 0-5.916 2.22-6.726 5.174v-.699c0-3.827-3.175-6.929-7.092-6.929a7.057 7.057 0 0 0-6.363 3.988V61.932c0-3.827-3.175-6.929-7.092-6.929-3.916 0-7.089 3.103-7.089 6.929v46.346c-1.083-.365-2.226-.606-3.434-.606-5.814 0-10.526 4.604-10.526 10.283v18.312c0 .155.041.299.047.452.482 11.352 9.428 30.974 28.772 30.974h18.454c9.342 0 19.958-8.883 21.572-21.21.177-.607.387-1.207.387-1.869z" className="fill-background"></path>
                <path d="M132.11 101.132c-2.154 0-4.123.805-5.6 2.187-.779-3.755-4.164-6.601-8.226-6.601-2.379 0-4.533.99-6.051 2.641a8.417 8.417 0 0 0-7.754-5.095 8.31 8.31 0 0 0-5.046 1.691c0 .021-.021.021-.021.021V61.937c0-4.538-3.774-8.231-8.39-8.231-4.616 0-8.39 3.693-8.39 8.231v44.661h-.041a9.153 9.153 0 0 0-2.092-.227c-6.523 0-11.816 5.198-11.816 11.593v18.298c0 .145.021.289.041.516.226 5.281 2.339 13.429 7.569 20.464 4 5.363 11.139 11.758 22.503 11.758h18.442c9.621 0 21.19-9.221 22.893-22.382.164-.578.369-1.238.369-2.001v-35.255c0-4.538-3.774-8.23-8.39-8.23zm5.805 43.485a5.826 5.826 0 0 1-.267 1.238l-.123.454c-1.559 12.006-11.754 20.093-20.288 20.093H98.796c-8.226 0-26.544-7.488-27.488-29.726 0-.124-.021-.247-.041-.412v-18.298c0-4.972 4.144-8.994 9.231-8.994.657 0 1.354.083 2.092.289V127.6h2.585v-17.534l.041.021v-48.15c0-3.115 2.605-5.632 5.805-5.632 3.2 0 5.805 2.517 5.805 5.632v37.606h.021v9.613h2.585v-9.324c1.026-1.836 2.913-2.971 5.046-2.971 2.995 0 5.457 2.207 5.764 5.054v10.17h2.585v-8.602c.718-2.496 2.892-4.167 5.456-4.167 3.159 0 5.744 2.455 5.805 5.508h-.021v9.221h2.585v-6.147c.718-2.496 2.892-4.167 5.457-4.167 3.2 0 5.805 2.537 5.805 5.632v35.254z" className="fill-secondary"></path>
                <path d="M99.432 92.633v3.321c0 .021-.021.021-.021.021v-3.342h.021z" className="fill-secondary"></path>
                <path d="M82.631 104.536v2.063h-.041v-2.063h.041z" className="fill-secondary"></path>
            </g>
        </svg>
    );
}

function LightbulbIllustration() {
    return (
        <svg preserveAspectRatio="xMidYMid meet" data-bbox="45.5 20.001 109 159.999" viewBox="45.5 20.001 109 159.999" height="100%" width="100%" xmlns="http://www.w3.org/2000/svg" data-type="color" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path d="M124.231 131.26H75.769v-1.939c0-5.927-2.443-11.659-6.878-16.14-8.923-9.015-13.438-21.451-12.39-34.121 1.751-21.141 19.122-38.185 40.405-39.647 12.248-.839 23.932 3.266 32.872 11.568 8.816 8.186 13.873 19.76 13.873 31.752 0 11.663-4.59 22.611-12.922 30.828-4.13 4.071-6.498 9.814-6.498 15.756v1.943zm-44.915-3.582h41.366c.399-6.301 3.087-12.3 7.512-16.662 7.644-7.539 11.856-17.584 11.856-28.284 0-11.003-4.64-21.622-12.729-29.133-8.203-7.617-18.922-11.387-30.167-10.613C77.63 44.327 61.697 59.961 60.09 79.353c-.963 11.629 3.18 23.043 11.366 31.314 4.696 4.743 7.45 10.73 7.86 17.011z"></path>
                <path d="M70.864 81.818a1.794 1.794 0 0 1-1.796-1.938c1.243-15.029 13.593-27.146 28.727-28.185a31.155 31.155 0 0 1 22.713 7.627c.745.653.819 1.785.162 2.528a1.809 1.809 0 0 1-2.542.16 27.562 27.562 0 0 0-20.084-6.741c-13.376.918-24.289 11.625-25.386 24.905a1.797 1.797 0 0 1-1.794 1.644z"></path>
                <path d="M122.698 140.039H77.304c-.994 0-1.8-.802-1.8-1.791s.806-1.791 1.8-1.791h45.394c.994 0 1.8.802 1.8 1.791s-.806 1.791-1.8 1.791z"></path>
                <path d="M100.973 170.603h-1.945c-12.971 0-23.524-10.499-23.524-23.403v-1.791h48.995v1.791c-.001 12.904-10.554 23.403-23.526 23.403zM79.184 148.99c.913 10.094 9.465 18.03 19.843 18.03h1.945c10.38 0 18.932-7.937 19.845-18.03H79.184z"></path>
                <path d="M100.001 180c-4.692 0-8.51-3.798-8.51-8.466v-2.346c0-.989.806-1.791 1.8-1.791s1.8.802 1.8 1.791v2.346c0 2.693 2.203 4.884 4.909 4.884s4.909-2.191 4.909-4.884v-2.368c0-.989.806-1.791 1.8-1.791s1.8.802 1.8 1.791v2.368c.001 4.668-3.816 8.466-8.508 8.466z"></path>
                <path d="M99.999 33.136c-.994 0-1.8-.802-1.8-1.791v-9.553c0-.989.806-1.791 1.8-1.791s1.8.802 1.8 1.791v9.553a1.794 1.794 0 0 1-1.8 1.791z"></path>
                <path d="M82.323 36.617a1.8 1.8 0 0 1-1.692-1.18l-3.284-8.977a1.789 1.789 0 0 1 1.076-2.296 1.803 1.803 0 0 1 2.308 1.071l3.284 8.977c.34.93-.142 1.958-1.076 2.296a1.8 1.8 0 0 1-.616.109z"></path>
                <path d="M66.911 45.901a1.801 1.801 0 0 1-1.38-.639l-6.173-7.318a1.785 1.785 0 0 1 .221-2.524 1.807 1.807 0 0 1 2.536.22l6.173 7.318c.64.758.54 1.888-.221 2.524a1.803 1.803 0 0 1-1.156.419z"></path>
                <path d="M55.616 59.87c-.305 0-.615-.077-.899-.24L46.4 54.854a1.788 1.788 0 0 1-.66-2.447 1.806 1.806 0 0 1 2.46-.656l8.317 4.776a1.788 1.788 0 0 1 .66 2.447 1.802 1.802 0 0 1-1.561.896z"></path>
                <path d="M117.677 36.617c-.204 0-.412-.035-.616-.108a1.79 1.79 0 0 1-1.076-2.296l3.284-8.977a1.803 1.803 0 0 1 2.308-1.071 1.79 1.79 0 0 1 1.076 2.296l-3.284 8.977a1.802 1.802 0 0 1-1.692 1.179z"></path>
                <path d="M133.089 45.901c-.408 0-.819-.137-1.156-.419a1.785 1.785 0 0 1-.222-2.523l6.172-7.318a1.806 1.806 0 0 1 2.537-.221c.761.636.861 1.765.222 2.523l-6.172 7.318c-.357.422-.866.64-1.381.64z"></path>
                <path d="M144.384 59.87a1.803 1.803 0 0 1-1.561-.896 1.787 1.787 0 0 1 .66-2.447l8.317-4.776a1.805 1.805 0 0 1 2.46.656 1.788 1.788 0 0 1-.66 2.447l-8.317 4.776c-.285.163-.594.24-.899.24z"></path>
            </g>
        </svg>
    );
}

function BookIllustration() {
    return (
        <svg preserveAspectRatio="xMidYMid meet" data-bbox="43 21 114 158" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="43 21 114 158" data-type="color" role="presentation" aria-hidden="true" aria-label="">
            <g>
                <path d="M58.624 179c-8.595 0-15.604-6.995-15.624-15.593a3.48 3.48 0 0 0 .007-.182V36.63c0-8.618 7.01-15.63 15.627-15.63h96.989c.76 0 1.377.618 1.377 1.377v126.627l-.012.052a1.357 1.357 0 0 0-.032.187 1.675 1.675 0 0 1-.122.476 1.307 1.307 0 0 1-.156.225l-.062.075-.103.056-.086.166-.055.054c-4.556 4.398-6.866 8.797-6.866 13.073 0 4.337 2.374 8.797 7.057 13.255.411.392.54.983.329 1.508a1.378 1.378 0 0 1-1.282.869H58.624zm0-28.505c-7.04 0-12.81 5.732-12.863 12.778l-.004.102c.012 7.088 5.785 12.871 12.867 12.871h93.632l-1.359-1.805c-2.752-3.656-4.146-7.381-4.146-11.071 0-3.69 1.395-7.415 4.146-11.07l1.359-1.805H58.624zM56.385 23.979c-6.156 1.094-10.624 6.414-10.624 12.65v117.496l1.917-1.888a15.659 15.659 0 0 1 9.04-4.367l.991-.121V23.744l-1.324.235zm97.859 123.752V23.754H60.46v123.977h93.784zm-81.39-78.084a1.378 1.378 0 0 1-1.376-1.377V34.897c0-.759.618-1.377 1.376-1.377h71.502c.76 0 1.377.618 1.377 1.377V68.27c0 .759-.618 1.377-1.377 1.377H72.854zm70.125-2.754V36.274H74.231v30.618h68.748zm-70.125 2.754a1.378 1.378 0 0 1-1.376-1.377V34.897c0-.759.618-1.377 1.376-1.377h71.502c.76 0 1.377.618 1.377 1.377V68.27c0 .759-.618 1.377-1.377 1.377H72.854zm70.125-2.754V36.274H74.231v30.618h68.748zm-11.138-8.774a1.378 1.378 0 0 0 0-2.754H85.374c-.76 0-1.377.618-1.377 1.377s.618 1.377 1.377 1.377h46.467zm0 0a1.378 1.378 0 0 0 0-2.754H85.374c-.76 0-1.377.618-1.377 1.377s.618 1.377 1.377 1.377h46.467zm-23.236-10.317a1.378 1.378 0 0 0 0-2.754h-23.23c-.76 0-1.377.618-1.377 1.377s.618 1.377 1.377 1.377h23.23zm0 0a1.378 1.378 0 0 0 0-2.754h-23.23c-.76 0-1.377.618-1.377 1.377s.618 1.377 1.377 1.377h23.23zm29.443 116.945a1.378 1.378 0 0 0 0-2.754H66.253c-.76 0-1.377.618-1.377 1.377s.618 1.377 1.377 1.377h71.795zm0 0a1.378 1.378 0 0 0 0-2.754H66.253c-.76 0-1.377.618-1.377 1.377s.618 1.377 1.377 1.377h71.795zm-66.671-24.055c-.787 0-1.427-.64-1.427-1.427V107.98c0-.787.64-1.427 1.427-1.427h12.448c.787 0 1.427.64 1.427 1.427v31.285c0 .787-.64 1.427-1.427 1.427H71.377zm11.021-2.853v-28.431h-9.595v28.431h9.595zm-11.021 2.853c-.787 0-1.427-.64-1.427-1.427V107.98c0-.787.64-1.427 1.427-1.427h12.448c.787 0 1.427.64 1.427 1.427v31.285c0 .787-.64 1.427-1.427 1.427H71.377zm11.021-2.853v-28.431h-9.595v28.431h9.595zm9.087 2.853c-.787 0-1.427-.64-1.427-1.427V97.127c0-.787.64-1.427 1.427-1.427h12.448c.787 0 1.427.64 1.427 1.427v42.138c0 .787-.64 1.427-1.427 1.427H91.485zm11.022-2.853V98.554h-9.595v39.285h9.595zm-11.022 2.853c-.787 0-1.427-.64-1.427-1.427V97.127c0-.787.64-1.427 1.427-1.427h12.448c.787 0 1.427.64 1.427 1.427v42.138c0 .787-.64 1.427-1.427 1.427H91.485zm11.022-2.853V98.554h-9.595v39.285h9.595zm29.195 2.853c-.787 0-1.427-.64-1.427-1.427v-53.63c0-.787.64-1.427 1.427-1.427h12.448c.787 0 1.427.64 1.427 1.427v53.631c0 .787-.64 1.427-1.427 1.427h-12.448zm11.022-2.853V87.062h-9.595v50.777h9.595zm-11.022 2.853c-.787 0-1.427-.64-1.427-1.427v-53.63c0-.787.64-1.427 1.427-1.427h12.448c.787 0 1.427.64 1.427 1.427v53.631c0 .787-.64 1.427-1.427 1.427h-12.448zm11.022-2.853V87.062h-9.595v50.777h9.595zm-31.449 2.853c-.787 0-1.427-.64-1.427-1.427v-61.93c0-.787.64-1.427 1.427-1.427h12.447c.787 0 1.427.64 1.427 1.427v61.931c0 .787-.64 1.427-1.427 1.427h-12.447zm11.02-2.853V78.762h-9.594v59.077h9.594zm-11.02 2.853c-.787 0-1.427-.64-1.427-1.427v-61.93c0-.787.64-1.427 1.427-1.427h12.447c.787 0 1.427.64 1.427 1.427v61.931c0 .787-.64 1.427-1.427 1.427h-12.447zm11.02-2.853V78.762h-9.594v59.077h9.594z"></path>
            </g>
        </svg>
    )
}