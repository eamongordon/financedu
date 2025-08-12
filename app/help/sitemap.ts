import { MetadataRoute } from 'next';
import { helpCategories } from '@/lib/help-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://financedu.org';
  
  const helpPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/help/search`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  // Add category pages
  helpCategories.forEach((category) => {
    helpPages.push({
      url: `${baseUrl}/help/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });

    // Add article pages
    category.articles.forEach((article) => {
      helpPages.push({
        url: `${baseUrl}/help/${category.slug}/${article.slug}`,
        lastModified: new Date(article.lastUpdated),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    });
  });

  return helpPages;
}
