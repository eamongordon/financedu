"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { Check, CircleHelp, FileText } from "lucide-react"

interface ActivityNavProps extends React.HTMLAttributes<HTMLElement> {
  activities: {
    id: string,
    type: "Article" | "Quiz",
    title: string
    href: string
    isComplete?: boolean
  }[]
}

export function ActivityNav({ className, activities, ...props }: ActivityNavProps) {
  const segments = useSelectedLayoutSegments()
  const currentActivityId = segments![segments!.length - 1]

  return (
    <nav
      className={cn(
        "flex md:flex-col divide-y border-t border-b",
        className
      )}
      {...props}
    >
      {activities.map((activity) => (
        <Link
          key={activity.id}
          href={activity.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "border-l-4 border-l-transparent py-8 rounded-none text-base [&_svg]:size-4 whitespace-normal",
            currentActivityId === activity.id
              ? "border-l-primary bg-accent hover:bg-muted"
              : "",
            "justify-start"
          )}
        >
          <div className="relative">
            <div className={
              cn("border flex justify-center items-center size-8 shrink-0 rounded-md mr-4 relative",
                currentActivityId === activity.id ? "dark:border-muted-foreground" : "",
                activity.isComplete ? "border-primary text-primary" : "")}
            >
              {activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
              {activity.isComplete && (
                <div className="text-white absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary rounded-full size-4 flex items-center justify-center [&_svg]:size-3">
                  <Check />
                </div>
              )}
            </div>
          </div>
          {activity.title}
        </Link>
      ))}
    </nav>
  )
}
