import { getPost } from '@/lib/actions';
import type { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { toPostDateString } from '@/lib/utils';

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
    const params = await props.params;

    const slug = params.slug;

    const post = await getPost(slug);

    const parentData = await parent;
    const previousImages = parentData.openGraph?.images || [];
    return {
        title: post?.title,
        description: post?.excerpt,
        openGraph: {
            ...parentData.openGraph,
            images: post?.coverImage ? [post?.coverImage] : previousImages,
            url: `/blog/${params.slug}`
        },
    }
}

export default async function SitePostPage(
    props: {
        params: Promise<{ slug: string }>;
    }
) {
    const params = await props.params;
    const slug = params.slug;
    const post = await getPost(slug);

    if (!post) {
        notFound();
    }

    return (
        <>
            <main className="my-5">
                <div className="m-auto mb-10 gap-5 sm:gap-7 flex flex-col items-center justify-center md:w-7/12 text-center">
                    <p className="m-auto w-10/12 text-sm text-stone-500 dark:text-stone-400 md:text-base">
                        {toPostDateString(post.publishedAt!)}
                    </p>
                    <h1 className="font-title text-3xl font-bold text-stone-800 dark:text-white md:text-5xl">
                        {post.title}
                    </h1>
                </div>
                <div className="relative m-auto mb-10 h-80 w-full max-w-screen-lg overflow-hidden md:h-150 md:w-5/6 md:rounded-2xl lg:w-2/3">
                    {post.coverImage && (
                        <Image
                            alt={post.title ?? "Article Image"}
                            width={1200}
                            height={630}
                            className="h-full w-full object-cover"
                            src={post.coverImage}
                        />
                    )}
                </div>
                <article
                    className="prose-md prose prose-stone m-auto w-11/12 dark:prose-invert sm:prose-lg sm:w-3/4"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </main>
        </>
    );
}