import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ThumbsUp, ThumbsDown, Share } from 'lucide-react';
import { getHelpArticle, getHelpArticlesByCategorySlug, getHelpCategories } from '@/lib/fetchers';

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
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-primary">
                        Help Center
                    </Link>
                    <span>/</span>
                    <Link href={`/help/${article.category.slug}`} className="hover:text-primary">
                        {article.category.name}
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{article.title}</span>
                </nav>

                {/* Back Button */}
                <Link
                    href={`/help/${article.category.slug}`}
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to {article.category.name}
                </Link>

                {/* Article Header */}
                <div className="bg-card rounded-lg p-8 shadow-sm border border-border mb-8">
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

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-6">
                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                                <Share className="w-5 h-5" />
                            </button>
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
                <div className="bg-card rounded-lg p-8 shadow-sm border border-border mb-8">
                    <article
                        className="prose-md prose prose-stone m-auto dark:prose-invert sm:prose-lg w-full"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Feedback Section */}
                <div className="bg-card rounded-lg p-6 shadow-sm border border-border mb-8">
                    <h3 className="text-lg font-semibold text-card-foreground mb-4">
                        Was this article helpful?
                    </h3>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            Yes, helpful
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors">
                            <ThumbsDown className="w-4 h-4" />
                            No, not helpful
                        </button>
                    </div>
                </div>

                {/* Related Articles */}
                <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
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
                <div className="mt-8 text-center">
                    <div className="bg-primary rounded-lg p-6 text-primary-foreground">
                        <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
                        <p className="text-primary-foreground/80 mb-4">
                            Contact our support team for personalized assistance.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-background text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted transition-colors"
                        >
                            Contact Support
                        </Link>
                    </div>
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
