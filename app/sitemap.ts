
import { MetadataRoute } from 'next'

const baseUrl = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    return [
        {
            url: baseUrl
        },
        {
            url: `${baseUrl}/login`
        },
        {
            url: `${baseUrl}/signup`
        },
        {
            url: `${baseUrl}/donate`
        },
        {
            url: `${baseUrl}/educators`
        },
        {
            url: `${baseUrl}/parents`
        },
        {
            url: `${baseUrl}/policy`
        },
        {
            url: `${baseUrl}/resources`
        },
        {
            url: `${baseUrl}/glossary`
        },
        {
            url: `${baseUrl}/tools/savings-calculator`
        },
        {
            url: `${baseUrl}/tools/compound-interest-calculator`
        },
        {
            url: `${baseUrl}/tools/simple-interest-calculator`
        },
        {
            url: `${baseUrl}/tools/four-function-calculator`
        },

    ]
}