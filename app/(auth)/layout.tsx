import { Suspense } from "react"
import Image from "next/image"

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="grid min-h-[calc(100dvh-64px)] lg:grid-cols-2">
            <div className="relative hidden bg-muted lg:block">
                <div className="absolute inset-0 bg-gradient-to-br from-[#00B5EA] to-[#02CF46] dark:brightness-[0.6]"></div>
                <Image
                    src="/homepage-banner.jpg"
                    alt="Image"
                    fill
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-75 opacity-20"
                />
            </div>
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <Suspense>
                            {children}
                        </Suspense>
                    </div>
                </div>
            </div>
        </div>
    )
}
