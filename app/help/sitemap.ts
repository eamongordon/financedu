import { MetadataRoute } from 'next';
import { helpCategories } from '@/lib/help-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://financedu.org';
  
  const helpPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/help` },
    { url: `${baseUrl}/help/search` },
    ...helpCategories.flatMap((category) => [
      { url: `${baseUrl}/help/${category.slug}` },
      ...category.articles.map((article) => ({
        url: `${baseUrl}/help/${category.slug}/${article.slug}`
      }))
    ])
  ];

  return helpPages;
}
