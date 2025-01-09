import React from 'react'
import { useLocation } from 'react-router-dom'

import routes, { RouteProp } from '@/coreui/routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import useGlobalConstantsContext from '@/Contexts/GlobalConstants'

type BreadCrumbElement = {
  pathname: string;
  name: string;
  active: boolean;
}

const AppBreadcrumb = () => {

  const {globalConstants} = useGlobalConstantsContext()
  const { ADMIN_PATH } = globalConstants; 

  const currentLocation = useLocation().pathname

  const getRouteName = (pathname: string, routes: RouteProp[]): string => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : ""
  }

  const getBreadcrumbs = (location: string): BreadCrumbElement[] => {
    const breadcrumbs: BreadCrumbElement[] = [];

    (location.startsWith(ADMIN_PATH) ? location.slice(ADMIN_PATH.length) : location)
      .split('/').reduce((prev, curr, index, array) => {
        const currentPathname = `${prev}/${curr}`
        const routeName: string = getRouteName(currentPathname, routes)
        routeName &&
          breadcrumbs.push({
            pathname: ADMIN_PATH + currentPathname,
            name: routeName,
            active: index + 1 === array.length ? true : false,
          })
        return currentPathname
      })
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      <CBreadcrumbItem href={ADMIN_PATH}>Home</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
