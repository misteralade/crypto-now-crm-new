import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'
import { getSEOForRoute, buildCanonicalUrl } from '../util/seo.util'
import type { SEOProps } from '../components/seo/SEO'

/**
 * Hook to get SEO configuration for current route
 * Useful for pages that need custom SEO beyond the root route
 */
export const useSEO = (customSEO?: Partial<SEOProps>): SEOProps => {
  const location = useLocation()
  const routeSEO = getSEOForRoute(location.pathname)
  const canonicalUrl = buildCanonicalUrl(location.pathname)

  return {
    ...routeSEO,
    ...customSEO,
    canonicalUrl: customSEO?.canonicalUrl || canonicalUrl,
    ogUrl: customSEO?.ogUrl || canonicalUrl,
  }
}

/**
 * Hook to update document title only (lightweight alternative)
 */
export const useDocumentTitle = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title
    document.title = title ? `${title} | CryptoNow CRM` : 'CryptoNow CRM'
    
    return () => {
      document.title = previousTitle
    }
  }, [title])
}
