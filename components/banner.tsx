import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';

interface Breadcrumb {
    href: string;
    label: string;
}

interface BannerProps {
    title: string;
    backgroundImage?: string;
    className?: string;
    breadcrumbs?: Breadcrumb[];
}

export default function Banner({ title, backgroundImage, className, breadcrumbs }: BannerProps) {
    return (
        <div className={cn("relative flex flex-col justify-center items-center w-full h-24 sm:h-40", breadcrumbs && "h-32")}>
            <div className={cn("absolute inset-0 bg-gradient-to-br from-[#00D9AE] to-[#3BDE2C] dark:brightness-[0.6]", className)} />
            <Image
                src={backgroundImage ?? "/homepage-banner.jpg"}
                alt={title}
                layout="fill"
                className="absolute inset-0 object-cover dark:brightness-75 opacity-10"
            />
            {breadcrumbs && (
                <Breadcrumb className="absolute top-4 left-4 sm:left-8 z-10">
                    <BreadcrumbList className="text-neutral-100">
                        {breadcrumbs.map((breadcrumb, index) => (
                            index < breadcrumbs.length - 1 ? (
                                <>
                                    <BreadcrumbItem key={index}>
                                        <BreadcrumbLink className="hover:text-white" asChild>
                                            <Link href={breadcrumb.href}>{breadcrumb.label}</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator key={`separator-${index}`} />
                                </>
                            ) : (
                                <BreadcrumbItem key={index}>
                                    <BreadcrumbPage className="text-white">{breadcrumb.label}</BreadcrumbPage>
                                </BreadcrumbItem>
                            )
                        ))}
                    </BreadcrumbList>
                </Breadcrumb>
            )}
            <h1 className={cn("text-white font-bold text-center z-10", breadcrumbs ? "text-2xl sm:text-4xl mt-6 sm:mt-2" : "text-4xl sm:text-6xl")}>{title}</h1>
        </div>
    );
}