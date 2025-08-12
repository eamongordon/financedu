import { NextRequest, NextResponse } from 'next/server';
import { searchArticles, helpCategories } from '@/lib/help-data';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json({ articles: [], query: '' });
  }

  const articles = searchArticles(query);
  
  // Add category information to each article
  const articlesWithCategory = articles.map(article => {
    // Find which category this article belongs to
    const category = helpCategories.find(cat => 
      cat.articles.some(a => a.slug === article.slug)
    );
    
    return {
      ...article,
      categorySlug: category?.slug,
      categoryTitle: category?.title,
    };
  });

  return NextResponse.json({
    articles: articlesWithCategory,
    query,
    count: articlesWithCategory.length,
  });
}
