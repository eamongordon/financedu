import { NextActivity } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNextActivityLink(courseId: string, moduleId: string, lessonId: string, nextActivity: NextActivity) {
  const href = nextActivity.module ? `/courses/${courseId}/${nextActivity.module.id}/${nextActivity.lesson.id}/${nextActivity.lesson.activities[0].id}` :
      nextActivity.lesson ? `/courses/${courseId}/${moduleId}/${nextActivity.lesson.id}` :
          nextActivity.activity ? `/courses/${courseId}/${moduleId}/${lessonId}/${nextActivity.activity.id}` :
              `/courses/${nextActivity.course.id}`;

  const label = nextActivity.module ?
      `Next: Module ${nextActivity.module.order}` :
      nextActivity.lesson ? `Next: Lesson ${nextActivity.lesson.order}` :
          nextActivity.activity ? `Next: ${nextActivity.activity.type}` : "All Done!";

  return { href, label };
}

export function getDisplayName(firstName?: string | null, lastName?: string | null, email?: string) {
  let nameStr = '';
  if (firstName) {
    nameStr += firstName;
  }
  if (lastName) {
    nameStr += ' ' + lastName;
  }
  if (!firstName && !lastName && email) {
    nameStr = email;
  }
  return nameStr;
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();
}