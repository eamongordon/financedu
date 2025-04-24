"use client"

import { useState, useEffect, useCallback } from "react";
import { X, Search, FileText, CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Label } from "../ui/label";
import { getActivityDisplay, getLessonDisplay } from "@/lib/fetchers";

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

interface StandardsFiltersProps {
    defaultValues: {
        title: string;
        state: string;
        gradeLevel: string;
        categories: string[];
    };
    lesson?: Lesson;
    activity?: Activity;
}

export function StandardsFilters({ defaultValues, lesson, activity }: StandardsFiltersProps) {
    const [title, setTitle] = useState(defaultValues.title);
    const [state, setState] = useState(defaultValues.state);
    const [gradeLevel, setGradeLevel] = useState(defaultValues.gradeLevel);
    const [selectedCategories, setSelectedCategories] = useState(defaultValues.categories);

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

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

    const handleTitleChange = useCallback((value: string) => {
        setTitle(value);
        updateQueryParams("title", value);
    }, [searchParams]);

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

    useEffect(() => {
        const handler = setTimeout(() => {
            updateQueryParams("title", title);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [title]);

    return (
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
                <div>
                    <Label>Categories</Label>
                    {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-3">
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
    );
}