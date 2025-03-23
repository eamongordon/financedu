import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { Courses, Resources, About, Donate } from './illustrations';
import { cn } from '@/lib/utils';

export function Explore() {
    return (
        <div className="flex flex-col md:flex-row gap-8 md:gap-10 mx-4 sm:mx-6 lg:mx-12 my-6 sm:my-16">
            <div className="md:w-1/3 space-y-4 md:space-y-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                <p className="mb-4 text-lg">We are Financedu, a 501(c)(3) non-profit dedicated to providing financial education for youth of all ages. Our comprehensive, engaging curriculum and programs teach individuals the skills necessary for lifelong financial success!</p>
                <Link href="/about" className={cn(buttonVariants({ size: "lg" }), "w-36 bg-primary text-white py-2 px-4")}>About Us</Link>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-7 sm:gap-12">
                <Link href="/courses" className="flex flex-col justify-start gap-4">
                    <h3 className="text-2xl font-semibold">Courses</h3>
                    <div className="bg-secondary/25 p-4 rounded-lg mb-2 flex items-center justify-center">
                        <Courses height="125" width="125" />
                    </div>
                    <p className="text-left">All of our courses are comprehensive, interactive, and standards-based - and always free of cost.</p>
                </Link>
                <Link href="/resources" className="flex flex-col justify-start gap-4">
                    <h3 className="text-2xl font-semibold">Resources</h3>
                    <div className="bg-secondary/25 p-4 rounded-lg mb-2 flex items-center justify-center">
                        <Resources height="125" width="125" />
                    </div>
                    <p className="text-left">Financedu offers interactive resources to provide the best learning experience possible.</p>
                </Link>
                <Link href="/about" className="flex flex-col justify-start gap-4">
                    <h3 className="text-2xl font-semibold">About Us</h3>
                    <div className="bg-secondary/25 p-4 rounded-lg mb-2 flex items-center justify-center">
                        <About height="125" width="125" />
                    </div>
                    <p className="text-left">Learn more about us, from our beginnings to our future endeavors.</p>
                </Link>
                <Link href="/donate" className="flex flex-col justify-start gap-4">
                    <h3 className="text-2xl font-semibold">Donate</h3>
                    <div className="bg-secondary/25 p-4 rounded-lg flex items-center justify-center">
                        <Donate height="125" width="125" />
                    </div>
                    <p className="text-left"> Support Us. We are a 501(c)(3) non-profit and rely on your donations to fulfill our mission.</p>
                </Link>
            </div>
        </div>
    );
}