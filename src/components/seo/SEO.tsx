import { Helmet } from 'react-helmet-async'

export interface SEOProps {
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

const defaultSEO: Required<Omit<SEOProps, 'ogTitle' | 'ogDescription' | 'ogImage' | 'ogUrl' | 'ogType' | 'twitterCard' | 'twitterTitle' | 'twitterDescription' | 'twitterImage' | 'canonicalUrl' | 'robots' | 'noindex' | 'nofollow'>> & Pick<SEOProps, 'ogTitle' | 'ogDescription' | 'ogImage' | 'ogUrl' | 'ogType' | 'twitterCard' | 'twitterTitle' | 'twitterDescription' | 'twitterImage' | 'canonicalUrl' | 'robots' | 'noindex' | 'nofollow'> = {
  title: 'CryptoNow CRM - Cryptocurrency Transaction Management System',
  description: 'Manage cryptocurrency transactions, users, disputes, and more with CryptoNow CRM. A comprehensive admin dashboard for crypto transaction management.',
  keywords: 'cryptocurrency, CRM, transaction management, crypto admin, blockchain, crypto dashboard',
  author: 'CryptoNow',
}

const SEO = ({
  title,
  description,
  keywords,
  author,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  twitterTitle,
  twitterDescription,
  twitterImage,
  canonicalUrl,
  robots,
  noindex = false,
  nofollow = false,
}: SEOProps) => {
  const finalTitle = title ? `${title} | CryptoNow CRM` : defaultSEO.title
  const finalDescription = description || defaultSEO.description
  const finalKeywords = keywords || defaultSEO.keywords
  const finalAuthor = author || defaultSEO.author
  const finalOgTitle = ogTitle || title || defaultSEO.title
  const finalOgDescription = ogDescription || description || defaultSEO.description
  const finalOgImage = ogImage || '/logo.png'
  const finalTwitterTitle = twitterTitle || ogTitle || title || defaultSEO.title
  const finalTwitterDescription = twitterDescription || ogDescription || description || defaultSEO.description
  const finalTwitterImage = twitterImage || ogImage || '/logo.png'
  
  // Build robots meta
  const robotsContent = robots || (() => {
    const parts: string[] = []
    if (noindex) parts.push('noindex')
    else parts.push('index')
    if (nofollow) parts.push('nofollow')
    else parts.push('follow')
    return parts.join(', ')
  })()

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{finalTitle}</title>
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content={finalAuthor} />
      <meta name="robots" content={robotsContent} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:site_name" content="CryptoNow CRM" />

      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalTwitterTitle} />
      <meta name="twitter:description" content={finalTwitterDescription} />
      <meta name="twitter:image" content={finalTwitterImage} />

      {/* Additional Meta Tags */}
      <meta name="theme-color" content="#03034D" />
      <meta name="application-name" content="CryptoNow CRM" />
      <meta name="apple-mobile-web-app-title" content="CryptoNow CRM" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  )
}

export default SEO
