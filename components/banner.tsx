import Image from 'next/image';
import { cn } from '@/lib/utils';

interface BannerProps {
    title: string;
    backgroundImage?: string;
    className?: string;
}

export default function Banner({ title, backgroundImage, className }: BannerProps) {
    return (
        <div className="relative flex justify-center items-center w-full h-24 sm:h-40">
            <div className={cn("absolute inset-0 bg-gradient-to-br from-[#00D9AE] to-[#3BDE2C] dark:brightness-[0.6]", className)} />
            <Image
                src={backgroundImage ?? "/homepage-banner.jpg"}
                alt={title}
                layout="fill"
                className="absolute inset-0 object-cover dark:brightness-75 opacity-10"
            />
            <h1 className="text-white text-4xl sm:text-6xl font-bold z-10">{title}</h1>
        </div>
    );
}