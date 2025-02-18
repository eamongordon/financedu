"use client"

import Link from "next/link"
import { useSelectedLayoutSegments } from "next/navigation"

import { cn } from "@/lib/utils"
import { buttonVariants } from "../ui/button"
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';
import { GraduationCap } from "lucide-react"
import { CompletionIcon } from "../ui/completion-icon";

interface ModuleNavProps extends React.HTMLAttributes<HTMLElement> {
  modules: {
    id: string
    title: string
    icon?: string | null,
    href: string
    isComplete: boolean
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
            "border-l-4 border-l-transparent py-8 rounded-none text-base [&_svg]:size-4 whitespace-normal gap-6",
            currentModuleId === module.id
              ? "border-l-primary bg-accent hover:bg-muted"
              : "",
            "justify-start"
          )}
        >
          <CompletionIcon
            isComplete={module.isComplete}
            icon={module.icon ? <DynamicIcon name={module.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} /> : <GraduationCap strokeWidth={1.5} />}
            isCurrent={currentModuleId === module.id}
          />
          {module.title}
        </Link>
      ))}
    </nav>
  )
}
