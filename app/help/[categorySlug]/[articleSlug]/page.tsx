import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, ThumbsUp, ThumbsDown, Share, Bookmark } from 'lucide-react';
import { getCategoryBySlug, getArticleBySlug } from '@/lib/help-data';

interface Props {
  params: {
    categorySlug: string;
    articleSlug: string;
  };
}

export default function ArticlePage({ params }: Props) {
  const category = getCategoryBySlug(params.categorySlug);
  const article = getArticleBySlug(params.categorySlug, params.articleSlug);

  if (!category || !article) {
    notFound();
  }

  // Convert markdown-style content to HTML (basic implementation)
  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-3xl font-bold text-foreground mb-6 mt-8">{line.substring(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold text-foreground mb-4 mt-6">{line.substring(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold text-foreground mb-3 mt-4">{line.substring(4)}</h3>;
        }
        
        // Bold text
        if (line.includes('**')) {
          const parts = line.split('**');
          return (
            <p key={index} className="text-muted-foreground mb-4 leading-relaxed">
              {parts.map((part, i) => 
                i % 2 === 1 ? <strong key={i} className="font-semibold text-foreground">{part}</strong> : part
              )}
            </p>
          );
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('- ')) {
          return <p key={index} className="text-muted-foreground mb-4 leading-relaxed">{line}</p>;
        }
        
        // List items
        if (line.startsWith('- ')) {
          return <li key={index} className="text-muted-foreground mb-2 ml-4">{line.substring(2)}</li>;
        }
        
        // Empty lines
        return <div key={index} className="mb-2"></div>;
      });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/help" className="hover:text-primary">
            Help Center
          </Link>
          <span>/</span>
          <Link href={`/help/${category.slug}`} className="hover:text-primary">
            {category.title}
          </Link>
          <span>/</span>
          <span className="text-foreground">{article.title}</span>
        </nav>

        {/* Back Button */}
        <Link
          href={`/help/${category.slug}`}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to {category.title}
        </Link>

        {/* Article Header */}
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded">
                  {category.title}
                </span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{article.readTime} min read</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-card-foreground mb-3">
                {article.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {article.description}
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-2 ml-6">
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Bookmark className="w-5 h-5" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Share className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Last updated: {new Date(article.lastUpdated).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </div>

        {/* Article Content */}
        <div className="bg-card rounded-lg p-8 shadow-sm border border-border mb-8">
          <div className="prose prose-lg max-w-none">
            {formatContent(article.content)}
          </div>
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
            {category.articles
              .filter(a => a.slug !== article.slug)
              .slice(0, 3)
              .map((relatedArticle) => (
                <Link
                  key={relatedArticle.slug}
                  href={`/help/${category.slug}/${relatedArticle.slug}`}
                  className="group flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-card-foreground group-hover:text-primary">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {relatedArticle.description}
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:text-primary" />
                </Link>
              ))}
          </div>
          
          {category.articles.length <= 1 && (
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
  const { helpCategories } = await import('@/lib/help-data');
  
  const params: { categorySlug: string; articleSlug: string; }[] = [];
  
  helpCategories.forEach((category) => {
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
export async function generateMetadata({ params }: Props) {
  const category = getCategoryBySlug(params.categorySlug);
  const article = getArticleBySlug(params.categorySlug, params.articleSlug);
  
  if (!category || !article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | ${category.title} - Help Center | Financedu`,
    description: article.description,
  };
}
