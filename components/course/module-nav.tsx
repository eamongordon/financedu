"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { FileText } from "lucide-react"

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
        "w-full flex md:flex-col divide-y border-t border-b",
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
            "border-l-4 border-l-transparent py-8 rounded-none text-base [&_svg]:size-4 whitespace-normal",
            currentModuleId === module.id
              ? "border-l-primary bg-accent hover:bg-muted"
              : "",
            "justify-start"
          )}
        >
          <div className={cn("border flex justify-center items-center size-8 shrink-0 rounded-md mr-4", currentModuleId === module.id ? "dark:border-muted-foreground" : "")}>
            <FileText strokeWidth={1.5} />
          </div>
          {module.title}
        </Link>
      ))}
    </nav>
  )
}
