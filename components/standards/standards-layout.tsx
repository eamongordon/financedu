"use client"

import { useState, useRef } from "react";
import { X, Search, FileText, CircleHelp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { getActivityDisplay, getLessonDisplay, getStandards, getTeacherClasses } from "@/lib/fetchers";
import { CreateAssignments } from "../account/classes/create-assigments";
import Link from "next/link";

const states = [
    "National",
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming"
];

const categories = [
    "Credit",
    "Risk",
    "Saving",
    "Investment",
    "Earning",
    "Spending",
    "Career Technical (CTE)"
];

const grades = Array.from({ length: 13 }, (_, i) => (i === 0 ? "K" : i.toString()));

type Lesson = Awaited<ReturnType<typeof getLessonDisplay>>;
type Activity = Awaited<ReturnType<typeof getActivityDisplay>>;
type Standards = Awaited<ReturnType<typeof getStandards>>;
type Classes = Awaited<ReturnType<typeof getTeacherClasses>>;

type StandardsFiltersProps = {
    standards: Standards;
    defaultValues: {
        title: string;
        state: string;
        gradeLevel: string;
        categories: string[];
    };
    lesson?: Lesson;
    activity?: Activity;
} & ({
    isTeacher: true;
    classes: Classes;
} | {
    isTeacher?: false;
    classes?: never;
});

export function StandardsLayout({ standards, defaultValues, lesson, activity, isTeacher, classes }: StandardsFiltersProps) {
    const [title, setTitle] = useState(defaultValues.title);
    const [state, setState] = useState(defaultValues.state);
    const [gradeLevel, setGradeLevel] = useState(defaultValues.gradeLevel);
    const [selectedCategories, setSelectedCategories] = useState(defaultValues.categories);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    const updateQueryParams = (key: string, value: string | string[] | undefined) => {
        const current = new URLSearchParams(Array.from(searchParams!.entries()));
        if (value) {
            if (Array.isArray(value)) {
                current.set(key, value.join(","));
            } else {
                current.set(key, value);
            }
        } else {
            current.delete(key);
        }
        const search = current.toString();
        const queryParam = search ? `?${search}` : "";
        router.push(`${pathname}${queryParam}`);
    };

    const handleRemoveLesson = () => {
        updateQueryParams("lessonId", undefined);
    };

    const handleRemoveActivity = () => {
        updateQueryParams("activityId", undefined);
    };

    const handleTitleChange = (value: string) => {
        setTitle(value);
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }
        debounceTimer.current = setTimeout(() => {
            updateQueryParams("title", value);
        }, 300);
    };

    const handleStateChange = (value: string) => {
        setState(value);
        updateQueryParams("state", value);
    };

    const handleGradeLevelChange = (value: string) => {
        setGradeLevel(value);
        updateQueryParams("gradeLevel", value);
    };

    const handleCategoriesChange = (category: string, checked: boolean) => {
        const updatedCategories = checked
            ? [...selectedCategories, category]
            : selectedCategories.filter((c) => c !== category);
        setSelectedCategories(updatedCategories);
        updateQueryParams("categories", updatedCategories);
    };

    return (
        <>
            <main className='flex flex-col md:flex-row'>
                <section className='w-full md:w-1/3 min-w-[350px] bg-muted p-4 lg:p-8'>
                    <div className='md:min-w-72 mx-auto'>
                        <>
                            {lesson && (
                                <div className="mb-8">
                                    <Label>Lesson</Label>
                                    <Button variant="outline" onClick={handleRemoveLesson} className="w-full justify-between overflow-hidden">
                                        <p className="truncate">{lesson.title}</p> <X className="ml-2" />
                                    </Button>
                                </div>
                            )}
                            {activity && (
                                <div className="mb-8">
                                    <Label>Activity</Label>
                                    <Button variant="outline" onClick={handleRemoveActivity} className="w-full justify-between">
                                        <span className="flex flex-row gap-2 items-center overflow-hidden">{activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />} <p className="truncate">{activity.title}</p></span> <X className="ml-2" />
                                    </Button>
                                </div>
                            )}
                            <div className="space-y-8">
                                <div>
                                    <Label>Title</Label>
                                    <div className="relative">
                                        <Input
                                            placeholder="Search by name..."
                                            value={title}
                                            onChange={(e) => handleTitleChange(e.target.value)}
                                        />
                                        <Search className="absolute right-2.5 top-2.5 h-5 w-5 text-gray-400" />
                                    </div>
                                </div>
                                <div>
                                    <Label>State</Label>
                                    <Select value={state} onValueChange={handleStateChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {states.map((state) => (
                                                <SelectItem key={state} value={state}>{state}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label>Grade Level</Label>
                                    <Select value={gradeLevel} onValueChange={handleGradeLevelChange}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Grade Level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {grades.map((grade) => (
                                                <SelectItem key={grade} value={grade}>{grade}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="flex flex-col gap-4">
                                    <Label>Categories</Label>
                                    {categories.map((category) => (
                                        <div key={category} className="flex items-center gap-3">
                                            <Checkbox
                                                checked={selectedCategories.includes(category)}
                                                onCheckedChange={(checked) => handleCategoriesChange(category, Boolean(checked))}
                                            />
                                            <Label>{category}</Label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    </div>
                </section>
                <section className='w-full md:w-3/4 p-4 lg:p-8'>
                    {standards.length ? (
                        <div className='divide-y'>
                            {standards.map((standard, index) => (
                                <div key={index} className='flex flex-col gap-2 py-4 first-of-type:pt-0'>
                                    <div>
                                        <h2 className='text-lg font-semibold text-chart-1'>{standard.title}</h2>
                                        <h4 className='font-semibold text-muted-foreground'>{standard.category}</h4>
                                    </div>
                                    <div>
                                        <h4 className='font-semibold text-secondary'>Description</h4>
                                        <p>{standard.description}</p>
                                    </div>
                                    <div>
                                        <h4 className='font-semibold text-secondary'>Objectives</h4>
                                        <p dangerouslySetInnerHTML={{ __html: standard.objectives ?? "" }}></p>
                                    </div>
                                    {standard.activityToStandards?.length > 0 && (
                                        <div>
                                            <h4 className='font-semibold text-secondary'>Content</h4>
                                            <div className='divide-y'>
                                                {standard.activityToStandards.map(({ activity }) => (
                                                    <div className='flex flex-row items-center justify-between gap-2 py-2'>
                                                        <Link
                                                            key={activity.id}
                                                            href={`/activities/${activity.slug}`}
                                                            className="flex flex-row items-center gap-4"
                                                        >
                                                            <div className='size-10 sm:size-12 flex justify-center items-center border rounded-lg'>
                                                                {activity.type === 'Quiz' ? <CircleHelp strokeWidth={1.5} /> : <FileText strokeWidth={1.5} />}
                                                            </div>
                                                            <div>
                                                                <p className='text-base font-semibold'>{activity.title}</p>
                                                                <p className='text-sm text-muted-foreground'>{activity.type}</p>
                                                            </div>
                                                        </Link>
                                                        {isTeacher && (
                                                            <div>
                                                                <CreateAssignments type="activity" defaultSelectedActivities={[activity.id]} classes={classes} />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-6">
                            <div className="flex flex-col gap-1 items-center justify-center">
                                <BookOpen className='text-muted-foreground' strokeWidth={1.5} size={36} />
                                <p className="text-lg font-semibold">No standards found.</p>
                                <p>Try removing some filters.</p>
                            </div>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setTitle("");
                                    setState("");
                                    setGradeLevel("");
                                    setSelectedCategories(["Credit", "Risk", "Saving", "Investment", "Earning", "Spending", "Career Technical (CTE)"]);
                                    router.push("/standards");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </section>
            </main >
        </>
    )
}