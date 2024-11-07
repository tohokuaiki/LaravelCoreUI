import React, { ReactElement, useEffect, useLayoutEffect } from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import useGlobalConstantsContext from '@/Contexts/GlobalConstants'
import { CIconType, CINavigation } from '../_nav'

export const AppSidebarNav = ({ items }:
  { items: CINavigation[]; }) => {

  const navLink = (
    name: string,
    icon?: ReactElement<CIconType>,
    badge?: {
      color: string;
      text: string;
    },
    indent: boolean = false
  ) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>
          )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: CINavigation, index: number, indent: boolean = false) => {

    const { ADMIN_PATH } = useGlobalConstantsContext()

    useEffect(() => {
      if (item.to) {
        item.to = ADMIN_PATH + item.to
      }
    }, [])

    const { component, name, badge, icon, ...rest } = item

    const Component = component
    return (
      <Component as="div" key={index}>
        {rest.to || rest.href ? (
          <CNavLink {...(rest.to && { as: NavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </CNavLink>
        ) : (
          navLink(name, icon, badge, indent)
        )}
      </Component>
    )
  }

  const navGroup = (item: CINavigation, index: number) => {
    const { component, name, icon, items, to, ...rest } = item
    const Component = component
    return (
      // @ts-ignore ...oops
      <Component compact as="div" key={index} toggler={navLink(name, icon)} {...rest}>
        {item.items?.map((item, index) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
