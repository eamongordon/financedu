"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { CircleHelp, FileText } from "lucide-react"

interface ActivityNavProps extends React.HTMLAttributes<HTMLElement> {
  activities: {
    id: string,
    type: "Article" | "Quiz",
    title: string
    href: string
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
            "border-l-4 border-l-transparent py-8 rounded-none text-base [&_svg]:size-4",
            currentActivityId === activity.id
              ? "border-l-primary bg-accent hover:bg-muted"
              : "",
            "justify-start"
          )}
        >
          <div className={cn("border flex justify-center items-center size-8 rounded-md mr-4", currentActivityId === activity.id ? "dark:border-muted-foreground" : "")}>
            {activity.type === "Article" ? <FileText strokeWidth={1.5} /> : <CircleHelp strokeWidth={1.5} />}
          </div>
          {activity.title}
        </Link>
      ))}
    </nav>
  )
}
