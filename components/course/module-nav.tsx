"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';
import { GraduationCap } from "lucide-react"

interface ModuleNavProps extends React.HTMLAttributes<HTMLElement> {
  modules: {
    id: string
    title: string
    icon?: string | null,
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
            {module.icon ? <DynamicIcon name={module.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} /> : <GraduationCap strokeWidth={1.5} />}
          </div>
          {module.title}
        </Link>
      ))}
    </nav>
  )
}
