'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, Clock, ArrowRight } from 'lucide-react';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  readTime: number;
  categorySlug?: string;
  categoryTitle?: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
      setIsOpen(false);
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/help/search?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setResults(data.articles.slice(0, 5)); // Show top 5 results
        setIsOpen(data.articles.length > 0);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setIsOpen(false);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      window.location.href = `/help/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <div ref={searchRef} className="relative max-w-2xl mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search for help articles..."
          className="w-full pl-12 pr-4 py-4 text-lg border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto"></div>
            </div>
          )}
          
          {!loading && results.length > 0 && (
            <>
              {results.map((article) => (
                <Link
                  key={`${article.categorySlug}-${article.slug}`}
                  href={`/help/${article.categorySlug}/${article.slug}`}
                  className="block p-4 hover:bg-muted border-b border-border last:border-b-0"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {article.categoryTitle && (
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                            {article.categoryTitle}
                          </span>
                        )}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{article.readTime} min</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-card-foreground text-sm">
                        {article.title}
                      </h4>
                      <p className="text-muted-foreground text-xs mt-1">
                        {article.description}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground ml-2 flex-shrink-0" />
                  </div>
                </Link>
              ))}
              
              {results.length > 0 && (
                <Link
                  href={`/help/search?q=${encodeURIComponent(query)}`}
                  className="block p-3 text-center text-primary hover:bg-muted text-sm font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View all results for &quot;{query}&quot;
                </Link>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
