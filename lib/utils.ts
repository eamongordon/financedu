import { NextActivity } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNextActivityLink(courseSlug: string, moduleSlug: string, lessonSlug: string, nextActivity: NextActivity) {
  const href = nextActivity.module ? `/courses/${courseSlug}/${nextActivity.module.id}/${nextActivity.lesson.slug}/${nextActivity.lesson.activities[0].slug}` :
    nextActivity.lesson ? `/courses/${courseSlug}/${moduleSlug}/${nextActivity.lesson.slug}/${nextActivity.lesson.activities[0].slug}` :
      nextActivity.activity ? `/courses/${courseSlug}/${moduleSlug}/${lessonSlug}/${nextActivity.activity.slug}` :
        `/courses/${nextActivity.course.slug}`;

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

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export const toPostDateString = (date: Date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export class NotFoundError extends Error {
  constructor(message: string) {
      super(message);
      this.name = "NotFoundError";
  }
}