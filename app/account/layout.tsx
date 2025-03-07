import { Metadata } from "next"
import { SidebarNav } from "@/components/account/sidebar-nav"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar" // Import Avatar component
import { auth } from "@/lib/auth"
import { getDisplayName, getInitials } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const defaultNavItemsTop = [
  {
    title: "Dashboard",
    href: "/account/learner",
    matchingHrefs: ["/account/learner", "/account/learner/progress"],
  }
]


const defaultNavItemsBottom = [
  {
    title: "Settings",
    href: "/account/settings"
  }
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default async function SettingsLayout({ children }: SettingsLayoutProps) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  const avatar = session?.user?.image;
  const nameStr = getDisplayName(session?.user.firstName, session?.user.lastName, session.user.email!);
  const initials = getInitials(nameStr);

  const navItems = [
    ...defaultNavItemsTop,
    ...(session?.user?.roles?.includes("parent") ? [{
      title: "Children",
      href: "/account/parent",
    }] : []),
    ...(session?.user?.roles?.includes("teacher") ? [{
      title: "Classes",
      href: "/account/teacher",
    }] : []),
    ...(!session?.user?.roles?.includes("teacher") ? [{
      title: "Classes",
      href: "/account/student",
    }] : []),
    ...defaultNavItemsBottom
  ];

  return (
    <>
      <div className="space-y-6 p-4 sm:p-10 pb-16">
        <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
          <aside className="-mx-4 md:w-1/4 lg:w-1/5">
            <div className="px-2 flex items-center space-x-4 mb-6">
              <Avatar className="lg:size-1/4 aspect-square">
                <AvatarImage src={avatar ?? undefined} alt={nameStr} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col justify-center gap-1 overflow-hidden">
                <span className="block leading-none font-semibold">Welcome,</span>
                <span className="block leading-none truncate">{nameStr}</span>
              </div>
            </div>
            <SidebarNav items={navItems} />
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </>
  )
}