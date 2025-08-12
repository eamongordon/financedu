'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, Clock } from 'lucide-react';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: string;
  readTime: number;
  categorySlug?: string;
  categoryTitle?: string;
}

interface SearchResponse {
  articles: SearchResult[];
  query: string;
  count: number;
}

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
        const data: SearchResponse = await response.json();
        setResults(data.articles);
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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
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
                  key={`${article.categorySlug}-${article.slug}`}
                  href={`/help/${article.categorySlug}/${article.slug}`}
                  className="group block bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {article.categoryTitle && (
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
                            {article.categoryTitle}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime} min read</span>
                        </div>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 mb-2">
                        {article.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-3">
                        {article.description}
                      </p>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Updated {new Date(article.lastUpdated).toLocaleDateString()}
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transform group-hover:translate-x-1 transition-transform mt-2" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* No Results State */}
        {!loading && hasSearched && results.length === 0 && query.trim() !== '' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try searching with different keywords or browse our categories.
            </p>
            <Link
              href="/help"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && query.trim() === '' && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Start typing to search
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Search through our help articles to find what you&apos;re looking for.
            </p>
            <Link
              href="/help"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              Or browse all categories →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
