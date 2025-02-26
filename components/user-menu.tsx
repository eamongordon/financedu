import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, Laptop2, Moon, Sun, User } from "lucide-react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { useTheme } from "next-themes"
import { type Roles } from "@/lib/db/schema"

interface UserMenuProps {
  imageSrc?: string
  name?: string
  email?: string
  isMobile?: boolean
  roles?: Roles
}

export default function UserMenu({ imageSrc, name, email, isMobile, roles }: UserMenuProps) {
  const initials = name
    ? name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
    : ''
  const { theme, setTheme } = useTheme();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative rounded-full justify-start p-0 hover:bg-inherit gap-5 h-auto">
          <Avatar className="size-10 md:size-8">
            {imageSrc ? (
              <AvatarImage src={imageSrc} alt={name || "User avatar"} />
            ) : null}
            <AvatarFallback>
              {initials || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
          <div className="flex md:hidden flex-col justify-start text-start gap-2">
            <p className="text-sm leading-none text-muted-foreground font-semibold">
              Signed in as
            </p>
            {name && (
              <p className="text-base font-semibold leading-none">{name || "Guest User"}</p>
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={isMobile ? "start" : "end"} forceMount>
        <DropdownMenuItem className="flex items-center">
          <div className="flex flex-col space-y-1">
            {name && (
              <p className="text-sm font-semibold leading-none">{name || "Guest User"}</p>
            )}
            {email && (
              <p className={name ? `text-xs leading-none text-muted-foreground` : `text-sm font-medium leading-none`}>
                {email}
              </p>
            )}
          </div>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account/learner">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings">Settings</Link>
        </DropdownMenuItem>
        {roles?.includes("parent") && (
          <DropdownMenuItem asChild>
            <Link href="/account/parent">My Children</Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <span>Theme: {theme === "light" ? "Light" : theme === "dark" ? "Dark" : "System"}</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                <span>Light</span>
                {theme === "light" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                <span>Dark</span>
                {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop2 className="mr-2 h-4 w-4" />
                <span>System</span>
                {theme === "system" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu >
  )
}