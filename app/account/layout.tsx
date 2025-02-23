import { Metadata } from "next"
import { SidebarNav } from "@/components/account/sidebar-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Import Avatar component
import { auth } from "@/lib/auth"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/account/learner",
    matchingHrefs: ["/account/learner", "/account/learner/progress"],
  },
  {
    title: "Account",
    href: "/account/settings",
  },
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const session = await auth();
  const avatar = session?.user?.image;
  const firstName = session?.user?.firstName;
  const lastName = session?.user?.lastName;
  const initials = `${firstName?.charAt(0) ?? ''}${lastName?.charAt(0) ?? ''}`;

  return (
    <>
      <div className="space-y-6 p-4 sm:p-10 pb-16">
        <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
          <aside className="-mx-4 md:w-1/4 lg:w-1/5">
            <div className="px-2 flex items-center space-x-4 mb-6">
              <Avatar className="lg:size-1/4 aspect-square">
                <AvatarImage src={avatar ?? undefined} alt={firstName ?? undefined}/>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center gap-1">
                <span className="block leading-none font-semibold">Welcome,</span>
                <span className="block leading-none">{firstName}</span>
              </div>
            </div>
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}