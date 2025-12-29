# SEO Setup for CryptoNow CRM

This document explains the SEO implementation for the CryptoNow CRM application.

## Overview

The SEO setup includes:
- **Meta Tags**: Title, description, keywords, and robots directives
- **Open Graph Tags**: For social media sharing (Facebook, LinkedIn, etc.)
- **Twitter Cards**: For Twitter sharing
- **Canonical URLs**: To prevent duplicate content issues
- **Robots.txt**: To control search engine crawling
- **Sitemap.xml**: To help search engines discover pages

## Components

### 1. SEO Component (`src/components/seo/SEO.tsx`)

A reusable React component that manages all SEO meta tags. It accepts the following props:

```typescript
interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  author?: string
  ogTitle?: string
  ogDescription?: string
  ogImage?: string
  ogUrl?: string
  ogType?: string
  twitterCard?: string
  twitterTitle?: string
  twitterDescription?: string
  twitterImage?: string
  canonicalUrl?: string
  robots?: string
  noindex?: boolean
  nofollow?: boolean
}
```

### 2. SEO Utility (`src/util/seo.util.ts`)

Contains:
- **SEO_CONFIG**: Pre-configured SEO settings for each route
- **getSEOForRoute()**: Function to get SEO config for a specific route
- **buildCanonicalUrl()**: Function to build canonical URLs

### 3. SEO Hook (`src/hooks/useSEO.ts`)

Custom hooks for SEO management:
- **useSEO()**: Get SEO configuration for the current route
- **useDocumentTitle()**: Lightweight hook to update document title only

## Usage

### Automatic SEO (Root Route)

SEO is automatically applied to all routes through the root route component (`src/routes/__root.tsx`). It detects the current route and applies the appropriate SEO configuration.

### Custom SEO in Pages

If you need custom SEO for a specific page, you can use the SEO component directly:

```tsx
import SEO from '../components/seo/SEO'

const MyPage = () => {
  return (
    <>
      <SEO
        title="Custom Page Title"
        description="Custom page description"
        keywords="custom, keywords"
        ogImage="/custom-image.png"
      />
      {/* Your page content */}
    </>
  )
}
```

### Using the SEO Hook

```tsx
import { useSEO } from '../hooks/useSEO'
import SEO from '../components/seo/SEO'

const MyPage = () => {
  const seo = useSEO({
    title: "Custom Title",
    description: "Custom description"
  })

  return (
    <>
      <SEO {...seo} />
      {/* Your page content */}
    </>
  )
}
```

### Lightweight Title Update

For simple title updates:

```tsx
import { useDocumentTitle } from '../hooks/useSEO'

const MyPage = () => {
  useDocumentTitle("My Page Title")
  
  return <div>Content</div>
}
```

## Configuration

### Adding New Routes

To add SEO configuration for a new route, update `src/util/seo.util.ts`:

```typescript
export const SEO_CONFIG: Record<string, SEOProps> = {
  // ... existing routes
  '/dashboard/new-route': {
    title: 'New Route',
    description: 'Description for the new route',
    keywords: 'relevant, keywords',
  },
}
```

### Updating Base SEO

Default SEO values are defined in `src/components/seo/SEO.tsx`:

```typescript
const defaultSEO = {
  title: 'CryptoNow CRM - Cryptocurrency Transaction Management System',
  description: 'Manage cryptocurrency transactions...',
  // ...
}
```

### Updating Domain

Update the domain in:
1. `src/util/seo.util.ts` - `buildCanonicalUrl()` function
2. `public/robots.txt` - Sitemap URL
3. `public/sitemap.xml` - All `<loc>` URLs

## Files

- `index.html` - Base meta tags (fallback for SSR/crawlers)
- `src/components/seo/SEO.tsx` - SEO component
- `src/util/seo.util.ts` - SEO configuration and utilities
- `src/hooks/useSEO.ts` - SEO hooks
- `src/routes/__root.tsx` - Root route with automatic SEO
- `public/robots.txt` - Search engine crawling rules
- `public/sitemap.xml` - Sitemap for search engines

## Best Practices

1. **Always provide unique titles and descriptions** for each page
2. **Use relevant keywords** but avoid keyword stuffing
3. **Set noindex: true** for pages that shouldn't be indexed (login, admin pages)
4. **Update sitemap.xml** when adding new public pages
5. **Use descriptive ogImage** for better social media sharing
6. **Keep descriptions under 160 characters** for optimal display

## Testing

To test SEO:
1. View page source and check meta tags
2. Use Google's Rich Results Test: https://search.google.com/test/rich-results
3. Use Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
4. Use Twitter Card Validator: https://cards-dev.twitter.com/validator

## Notes

- The application uses `react-helmet-async` for managing head tags
- SEO is applied automatically via the root route
- All routes inherit base SEO from `index.html`
- Custom SEO can override default values per route
