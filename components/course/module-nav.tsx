"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"

interface ModuleNavProps extends React.HTMLAttributes<HTMLElement> {
  modules: {
    id: string
    title: string
    href: string
  }[]
}

export function ModuleNav({ className, modules, ...props }: ModuleNavProps) {
  const segments = useSelectedLayoutSegments()
  const currentModuleId = segments![segments!.length - 1]

  return (
    <nav
      className={cn(
        "flex space-x-2 md:flex-col md:space-x-0 md:space-y-1",
        className
      )}
      {...props}
    >
      {modules.map((module) => (
        <Link
          key={module.id}
          href={module.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            currentModuleId === module.id
              ? "bg-muted hover:bg-muted"
              : "hover:bg-transparent hover:underline",
            "justify-start"
          )}
        >
          {module.title}
        </Link>
      ))}
    </nav>
  )
}
