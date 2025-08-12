'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, LoaderCircle } from 'lucide-react';
import { searchHelpArticles } from '@/lib/fetchers';

type SearchResult = Awaited<ReturnType<typeof searchHelpArticles>>[number];

export default function HelpSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Debounce search
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/help/search?q=${encodeURIComponent(query)}`);
        const data: SearchResult[] = await response.json();
        setResults(data);
        setHasSearched(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Search Help Articles
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to your questions
          </p>
        </div>

        {/* Search Input */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
              autoFocus
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="flex justify-center mb-4">
              <LoaderCircle size={48} className="text-primary animate-spin" />
            </div>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Searching...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && hasSearched && (
          <div>
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-300">
                {results.length === 0 
                  ? `No results found for "${query}"`
                  : `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`
                }
              </p>
            </div>

            <div className="space-y-4">
              {results.map((article) => (
                <Link
                  key={`${article.category.slug}-${article.slug}`}
                  href={`/help/${article.category.slug}/${article.slug}`}
                  className="group block bg-card rounded-lg p-6 transition-all duration-200 border border-border hover:border-primary"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {article.category.name && (
                          <span className="bg-muted text-primary px-2 py-1 rounded text-xs">
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-card-foreground group-hover:text-primary mb-2">
                        {article.title}
                      </h2>
                      <p className="text-muted-foreground mb-3">
                        {article.excerpt}
                      </p>
                      <div className="text-sm text-muted-foreground">
                        Updated {new Date(article.updatedAt!).toLocaleDateString()}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transform group-hover:translate-x-1 transition-transform mt-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && hasSearched && results.length === 0 && query.trim() !== '' && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Search className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              No articles found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try searching with different keywords or browse our categories.
            </p>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && query.trim() === '' && (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Search size={48} className="text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-card-foreground mb-2">
              Start typing to search
            </h3>
            <p className="text-muted-foreground mb-6">
              Search through our help articles to find what you&apos;re looking for.
            </p>
            <Link
              href="/help"
              className="text-primary hover:text-primary/80"
            >
              Or browse all categories →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
