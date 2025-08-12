import { NextRequest, NextResponse } from 'next/server';
import { searchHelpArticles } from '@/lib/fetchers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json({ articles: [], query: '' });
  }

  const articles = await searchHelpArticles(query);
  
  // Format articles for the response
  const formattedArticles = articles.map(article => ({
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    categorySlug: article.category.slug,
    categoryTitle: article.category.name,
  }));

  return NextResponse.json({
    articles: formattedArticles,
    query,
    count: formattedArticles.length,
  });
}
