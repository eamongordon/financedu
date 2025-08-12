import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getHelpArticle, getHelpArticlesByCategorySlug, getHelpCategories } from '@/lib/fetchers';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { FeedbackSection } from '@/components/help/feedback-section';

interface Props {
    params: Promise<{
        categorySlug: string;
        articleSlug: string;
    }>;
}

export default async function ArticlePage(props: Props) {
    const params = await props.params;
    const article = await getHelpArticle(params.articleSlug);

    if (!article) {
        notFound();
    }

    // Get related articles from the same category
    const relatedArticles = (await getHelpArticlesByCategorySlug(article.category.slug))
        .filter(a => a.slug !== article.slug)
        .slice(0, 3);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <Breadcrumb className="mb-8">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/help">Help Center</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href={`/help/${article.category.slug}`}>{article.category.name}</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{article.title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Back Button */}
                <Link
                    href={`/help/${article.category.slug}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to {article.category.name}
                </Link>

                {/* Article Header */}
                <div className="pb-8 border-b">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                <span className="bg-muted text-muted-foreground px-2 py-1 rounded">
                                    {article.category.name}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold text-card-foreground mb-3">
                                {article.title}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {article.excerpt}
                            </p>
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Last updated: {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        }) : 'Recently'}
                    </div>
                </div>

                {/* Article Content */}
                <div className="py-8">
                    <article
                        className="prose-md prose prose-stone dark:prose-invert sm:prose-lg w-full"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Feedback Section */}
                <FeedbackSection />

                {/* Related Articles */}
                <div className="rounded-lg">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Related Articles
                    </h3>
                    <div className="space-y-3">
                        {relatedArticles.map((relatedArticle) => (
                            <Link
                                key={relatedArticle.slug}
                                href={`/help/${article.category.slug}/${relatedArticle.slug}`}
                                className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                            >
                                <div>
                                    <h4 className="font-medium text-card-foreground group-hover:text-primary">
                                        {relatedArticle.title}
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {relatedArticle.excerpt}
                                    </p>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:text-primary" />
                            </Link>
                        ))}
                    </div>

                    {relatedArticles.length === 0 && (
                        <p className="text-muted-foreground text-center py-4">
                            No related articles in this category yet.
                        </p>
                    )}
                </div>

                {/* Contact Support CTA */}
                <div className="flex flex-col items-center justify-center gap-4 mt-8 text-center py-8 border-t">
                    <h2 className="text-xl sm:text-2xl font-semibold">Still Need Help?</h2>
                    <div>
                        <p className="text-muted-foreground">Contact our support team for personalized assistance.</p>
                    </div>
                    <Link href="mailto:info@financedu.org" className={cn(buttonVariants())}>
                        Contact Us
                    </Link>
                </div>
            </div>
        </div>
    );
}

// Generate static params for all articles
export async function generateStaticParams() {
    const categories = await getHelpCategories();

    const params: { categorySlug: string; articleSlug: string; }[] = [];

    categories.forEach((category) => {
        category.articles.forEach((article) => {
            params.push({
                categorySlug: category.slug,
                articleSlug: article.slug,
            });
        });
    });

    return params;
}

// Generate metadata for SEO
export async function generateMetadata(props: Props) {
    const params = await props.params;
    const article = await getHelpArticle(params.articleSlug);

    if (!article) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: `${article.title} | ${article.category.name} - Help Center | Financedu`,
        description: article.excerpt,
    };
}
