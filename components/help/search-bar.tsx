'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, LoaderCircle } from 'lucide-react';
import { Input } from '../ui/input';
import type { searchHelpArticles } from '@/lib/fetchers';

type SearchResult = Awaited<ReturnType<typeof searchHelpArticles>>[number];

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
        setResults(data.slice(0, 5)); // Show top 5 results
        setIsOpen(data.length > 0);
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
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          placeholder="Search for help articles..."
          className="w-full h-auto pl-12 pr-4 py-4 text-lg md:text-lg rounded-xl bg-background text-foreground"
        />
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading && (
            <div className="p-4 text-center">
              <LoaderCircle size={20} className="text-primary animate-spin mx-auto" />
            </div>
          )}
          
          {!loading && results.length > 0 && (
            <>
              {results.map((article) => (
                <Link
                  key={`${article.category.slug}-${article.slug}`}
                  href={`/help/${article.category.slug}/${article.slug}`}
                  className="block p-4 hover:bg-muted border-b border-border last:border-b-0"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-start justify-between text-left">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {article.category.name && (
                          <span className="bg-muted text-muted-foreground px-2 py-1 rounded text-xs">
                            {article.category.name}
                          </span>
                        )}
                      </div>
                      <h4 className="font-semibold text-card-foreground text-sm">
                        {article.title}
                      </h4>
                      {article.excerpt && (
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2">
                          {article.excerpt}
                        </p>
                      )}
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
