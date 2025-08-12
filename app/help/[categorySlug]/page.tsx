import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, ArrowRight } from 'lucide-react';
import { getCategoryBySlug } from '@/lib/help-data';

interface Props {
  params: {
    categorySlug: string;
  };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.categorySlug);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/help" className="hover:text-primary">
            Help Center
          </Link>
          <span>/</span>
          <span className="text-foreground">{category.title}</span>
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
            <span className="text-4xl">{category.icon}</span>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {category.title}
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
              className="group block bg-card rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-border hover:border-primary"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary mb-2">
                    {article.title}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    {article.description}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} min read</span>
                    </div>
                    <span>Updated {new Date(article.lastUpdated).toLocaleDateString()}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-transform mt-2" />
              </div>
            </Link>
          ))}
        </div>

        {/* No Articles State */}
        {category.articles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No articles yet
            </h3>
            <p className="text-muted-foreground">
              We&apos;re working on adding helpful articles to this category.
            </p>
          </div>
        )}

        {/* Related Categories */}
        <div className="mt-16 pt-8 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Other Categories
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="text-center text-muted-foreground py-8">
              <Link
                href="/help"
                className="text-primary hover:text-primary/80"
              >
                Browse all categories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  const { helpCategories } = await import('@/lib/help-data');
  
  return helpCategories.map((category) => ({
    categorySlug: category.slug,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: Props) {
  const category = getCategoryBySlug(params.categorySlug);
  
  if (!category) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${category.title} - Help Center | Financedu`,
    description: category.description,
  };
}
