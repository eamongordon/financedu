"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"

interface ActivityNavProps extends React.HTMLAttributes<HTMLElement> {
  activities: {
    id: string
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
        "flex space-x-2 md:flex-col md:space-x-0 md:space-y-1",
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
            currentActivityId === activity.id
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {activity.title}
        </Link>
      ))}
    </nav>
  )
}
