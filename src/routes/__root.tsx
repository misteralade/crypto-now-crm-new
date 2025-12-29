import { createRootRoute, Outlet, useLocation } from '@tanstack/react-router'
import NotFound from '../pages/NotFound'
import SEO from '../components/seo/SEO'
import { getSEOForRoute, buildCanonicalUrl } from '../util/seo.util'

const RootComponent = () => {
  const location = useLocation()
  const seoConfig = getSEOForRoute(location.pathname)
  const canonicalUrl = buildCanonicalUrl(location.pathname)

  return (
    <>
      <SEO
        {...seoConfig}
        canonicalUrl={canonicalUrl}
        ogUrl={canonicalUrl}
      />
      <Outlet />
    </>
  )
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
})