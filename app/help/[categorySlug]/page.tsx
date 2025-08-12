import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, FileText, GraduationCap } from 'lucide-react';
import { getHelpCategory, getHelpCategories } from '@/lib/fetchers';
import { CompletionIcon } from '@/components/ui/completion-icon';
import { DynamicIcon, dynamicIconImports } from "lucide-react/dynamic";

interface Props {
    params: Promise<{
        categorySlug: string;
    }>;
}

export default async function CategoryPage(props: Props) {
    const params = await props.params;
    const category = await getHelpCategory(params.categorySlug);
    const allCategories = await getHelpCategories();
    if (!category) {
        notFound();
    }
    // Exclude current category
    const otherCategories = allCategories.filter((c) => c.slug !== category.slug);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                    <Link href="/help" className="hover:text-primary">
                        Help Center
                    </Link>
                    <span>/</span>
                    <span className="text-foreground">{category.name}</span>
                </nav>

                {/* Back Button */}
                <Link
                    href="/help"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-6 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Help Center
                </Link>

                {/* Category Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">
                            <CompletionIcon
                                icon={category.icon ? <DynamicIcon name={category.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} className='text-muted-foreground' /> : <GraduationCap strokeWidth={1.5} className='text-muted-foreground' />}
                                isComplete={false}
                            />
                        </span>
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">
                                {category.name}
                            </h1>
                            <p className="text-lg text-muted-foreground">
                                {category.description}
                            </p>
                        </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {category.articles.length} articles in this category
                    </div>
                </div>

                {/* Articles List */}
                <div className="space-y-4">
                    {category.articles.map((article) => (
                        <Link
                            key={article.slug}
                            href={`/help/${category.slug}/${article.slug}`}
                            className="group block bg-card rounded-lg p-6 transition-all duration-200 border border-border hover:border-primary"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary mb-2">
                                        {article.title}
                                    </h2>
                                    <p className="text-muted-foreground mb-4">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Updated {article.updatedAt ? new Date(article.updatedAt).toLocaleDateString() : 'Recently'}</span>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-transform mt-2" />
                            </div>
                        </Link>
                    ))}
                </div>

                {/* No Articles State */}
                {category.articles.length === 0 && (
                    <div className="flex flex-col items-center justify-center gap-2 text-center py-12">
                        <FileText strokeWidth={1.5} size={48} className="text-secondary" />
                        <div className='flex flex-col items-center justify-center gap-2'>
                            <h3 className="text-xl font-semibold text-foreground">
                                No articles yet
                            </h3>
                            <p className="text-muted-foreground">
                                But don&apos;t worry, we&apos;re working on adding some.
                            </p>
                        </div>
                    </div>
                )}

                {/* Related Categories */}
                <div className="mt-16 pt-8 border-t border-border">
                    <h3 className="text-lg font-semibold text-foreground mb-4">
                        Other Categories
                    </h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {otherCategories.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8">
                                <Link
                                    href="/help"
                                    className="text-primary hover:text-primary/80"
                                >
                                    Browse all categories →
                                </Link>
                            </div>
                        ) : (
                            otherCategories.map((cat) => (
                                <Link
                                    key={cat.slug}
                                    href={`/help/${cat.slug}`}
                                    className="flex flex-col items-center gap-2 bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors text-center"
                                >
                                    <span className="text-3xl mb-2">
                                        <CompletionIcon
                                            icon={cat.icon ? <DynamicIcon name={cat.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} className='text-muted-foreground' /> : <GraduationCap strokeWidth={1.5} className='text-muted-foreground' />}
                                            isComplete={false}
                                        />
                                    </span>
                                    <span className="font-semibold text-card-foreground">{cat.name}</span>
                                    <span className="text-sm text-muted-foreground mb-2">{cat.articles.length} article{cat.articles.length === 1 ? '' : 's'}</span>
                                    <span className="text-muted-foreground text-xs line-clamp-2">{cat.description}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Generate static params for all categories
export async function generateStaticParams() {
    const categories = await getHelpCategories();

    return categories.map((category) => ({
        categorySlug: category.slug,
    }));
}

// Generate metadata for SEO
export async function generateMetadata(props: Props) {
    const params = await props.params;
    const category = await getHelpCategory(params.categorySlug);

    if (!category) {
        return {
            title: 'Category Not Found',
        };
    }

    return {
        title: `${category.name} - Help Center | Financedu`,
        description: category.description,
    };
}
