import type { Metadata } from 'next';
import { getPosts } from "@/lib/fetchers";
import Link from "next/link";
import Image from "next/image";
import { toPostDateString } from "@/lib/utils";

export const metadata: Metadata = {
    title: 'Blog',
    description: 'Keep up with the latest news and updates from Financedu.',
}

export default async function PostsPage() {
    const posts = await getPosts();
    return (
        <section className='flex-col justify-center items-center py-4 px-6 w-full'>
            <ul
                role='list'
                className='w-full flex flex-col gap-8'
            >
                {posts?.map(post => (
                    <li key={post.slug}>
                        <Link href={`/blog/${post.slug}`} className='flex w-full flex-col sm:flex-row gap-8 hover:opacity-65'>
                            {post.coverImage ? (
                                <div className="w-full sm:w-[45%] h-52 sm:h-80">
                                    <Image
                                        alt='post Image'
                                        src={post.coverImage}
                                        width={500}
                                        height={350}
                                        className="w-full h-full object-cover rounded-xl"
                                    />
                                </div>
                            ) : null}
                            <div className={`w-full ${post.coverImage ? "sm:w-[55%]" : ""} flex flex-col justify-center gap-4`}>
                                <p className="text-sm opacity-70">
                                    {toPostDateString(post.publishedAt!)}
                                </p>
                                <h3 className="text-4xl font-bold">{post.title}</h3>
                                <p className="text-lg">{post.excerpt}</p>
                            </div>
                        </Link>
                    </li>
                ))}
            </ul>
        </section>
    );
}