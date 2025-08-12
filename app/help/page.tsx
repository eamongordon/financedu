import Link from 'next/link';
import { Clock, ArrowRight, GraduationCap } from 'lucide-react';
import { getHelpCategories } from '@/lib/fetchers';
import SearchBar from '@/components/help/search-bar';
import { CompletionIcon } from '@/components/ui/completion-icon';
import { DynamicIcon, dynamicIconImports } from 'lucide-react/dynamic';

export default async function HelpCenter() {
    const categories = await getHelpCategories();

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">
                        How can we help you?
                    </h1>
                    <p className="text-xl text-muted-foreground mb-8">
                        Find answers and learn how to use Financedu
                    </p>

                    {/* Search Bar */}
                    <SearchBar />
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 mb-12">
                    {categories.map((category) => (
                        <Link
                            key={category.slug}
                            href={`/help/${category.slug}`}
                            className="group bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border hover:border-primary"
                        >
                            <div className="flex items-start gap-4">
                                <div className="text-3xl mb-2">
                                    <CompletionIcon
                                        icon={category.icon ? <DynamicIcon name={category.icon as keyof typeof dynamicIconImports} strokeWidth={1.5} className='text-muted-foreground' /> : <GraduationCap strokeWidth={1.5} className='text-muted-foreground' />}
                                        isComplete={false}
                                    />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="text-xl font-semibold group-hover:text-primary dark:group-hover:text-primary">
                                            {category.name}
                                        </h3>
                                        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary dark:group-hover:text-primarytransform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                    <p className="text-muted-foreground mb-4">
                                        {category.description}
                                    </p>
                                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                        <span>{category.articles.length} articles</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Popular Articles */}
                <div className="rounded-xl p-8 shadow-sm border">
                    <h2 className="text-2xl font-bold mb-6">Popular Articles</h2>
                    <div className="space-y-4">
                        {categories.slice(0, 2).map((category) =>
                            category.articles.slice(0, 2).map((article) => (
                                <Link
                                    key={`${category.slug}-${article.slug}`}
                                    href={`/help/${category.slug}/${article.slug}`}
                                    className="group flex items-start gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold group-hover:text-primary mb-1">
                                            {article.title}
                                        </h3>
                                        <p className="text-muted-foreground text-sm mb-2">
                                            {article.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                            <span className="capitalize">{category.name}</span>
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                <span>5 min read</span>
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-muted group-hover:text-primary mt-1" />
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-12">
                    <div className="bg-primary rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-2">Still need help?</h3>
                        <p className="text-primary mb-6">
                            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
                        </p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-muted transition-colors"
                        >
                            Contact Support
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
