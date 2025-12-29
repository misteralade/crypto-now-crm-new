import type { SEOProps } from '../components/seo/SEO'

/**
 * SEO configuration for different routes
 */
export const SEO_CONFIG: Record<string, SEOProps> = {
  // Home/Login
  '/': {
    title: 'Login',
    description: 'Sign in to CryptoNow CRM to manage cryptocurrency transactions, users, and more.',
    noindex: true, // Login pages typically shouldn't be indexed
  },
  
  // Dashboard
  '/dashboard': {
    title: 'Dashboard',
    description: 'View analytics and overview of cryptocurrency transactions, users, and system metrics.',
  },
  
  // Transactions
  '/dashboard/transactions': {
    title: 'Manage Transactions',
    description: 'View and manage all cryptocurrency transactions. Filter, search, and export transaction data.',
    keywords: 'crypto transactions, transaction management, cryptocurrency payments, blockchain transactions',
  },
  
  // Users
  '/dashboard/users': {
    title: 'User Management',
    description: 'Manage user accounts, view user profiles, transaction history, and user statistics.',
    keywords: 'user management, crypto users, user profiles, user administration',
  },
  
  // Disputes
  '/dashboard/disputes': {
    title: 'Dispute Management',
    description: 'Manage and resolve cryptocurrency transaction disputes. Track dispute status and resolution.',
    keywords: 'crypto disputes, transaction disputes, dispute resolution, customer support',
  },
  
  // Coin Management
  '/dashboard/coin-management': {
    title: 'Coin Management',
    description: 'Manage supported cryptocurrencies, add new coins, and configure coin settings.',
    keywords: 'cryptocurrency management, coin settings, crypto configuration, supported coins',
  },
  
  // Notifications
  '/dashboard/notifications': {
    title: 'Notifications',
    description: 'View and manage system notifications and alerts.',
  },
  
  // Audit Trails
  '/dashboard/audit-trails': {
    title: 'Audit Trails',
    description: 'View system audit logs and track administrative actions.',
    keywords: 'audit logs, system logs, activity tracking, security logs',
  },
  
  // Admin Management
  '/dashboard/manage-admins': {
    title: 'Admin Management',
    description: 'Manage administrator accounts and permissions.',
    noindex: true, // Admin pages shouldn't be indexed
  },
  
  // Testimonials
  '/dashboard/testimonials': {
    title: 'Testimonials',
    description: 'Manage customer testimonials and reviews.',
  },
}

/**
 * Get SEO configuration for a specific route
 */
export const getSEOForRoute = (pathname: string): SEOProps => {
  // Try exact match first
  if (SEO_CONFIG[pathname]) {
    return SEO_CONFIG[pathname]
  }
  
  // Try to match dynamic routes (e.g., /dashboard/users/:id)
  for (const [route, seo] of Object.entries(SEO_CONFIG)) {
    if (pathname.startsWith(route)) {
      return seo
    }
  }
  
  // Default SEO
  return {
    title: 'CryptoNow CRM',
    description: 'Cryptocurrency Transaction Management System',
  }
}

/**
 * Build canonical URL from pathname
 */
export const buildCanonicalUrl = (pathname: string): string => {
  // In production, replace with your actual domain
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://cryptonow-crm.com'
  
  return `${baseUrl}${pathname}`
}
