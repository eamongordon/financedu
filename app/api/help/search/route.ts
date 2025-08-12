import { NextRequest, NextResponse } from 'next/server';
import { searchHelpArticles } from '@/lib/fetchers';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query || query.trim() === '') {
    return NextResponse.json({ articles: [], query: '' });
  }

  const articles = await searchHelpArticles(query);

  return NextResponse.json(articles);
}
