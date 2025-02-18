"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { CircleHelp, FileText } from "lucide-react"
import { CompletionIcon } from "../ui/completion-icon"

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
        "flex flex-col divide-y border-t border-b w-full",
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
            "border-l-4 border-l-transparent py-8 rounded-none text-base whitespace-normal",
            currentActivityId === activity.id
              ? "border-l-primary bg-accent hover:bg-muted"
              : "",
            "justify-start"
          )}
        >
          <CompletionIcon
            isComplete={activity.isComplete ? true : false}
            icon={activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
            isCurrent={currentActivityId === activity.id}
          />
          {activity.title}
        </Link>
      ))}
    </nav>
  )
}
