import React, { ReactElement } from 'react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilUser } from '@coreui/icons'
import { CNavItem, CNavTitle } from '@coreui/react'
import { CIconProps } from '@coreui/icons-react/dist/CIcon'
import { CNavItemProps } from '@coreui/react/dist/esm/components/nav/CNavItem'
import { PolymorphicRefForwardingComponent } from '@coreui/react/dist/esm/helpers'
import { CNavTitleProps } from '@coreui/react/dist/esm/components/nav/CNavTitle'

export type CIconType = React.ForwardRefExoticComponent<CIconProps & React.RefAttributes<SVGSVGElement>>;
type CIconComponentType =
  PolymorphicRefForwardingComponent<'li', CNavItemProps> |
  PolymorphicRefForwardingComponent<'li', CNavTitleProps>

export type CINavigation = {
  component: CIconComponentType;
  name: string;
  role?: string;
  to?: string;
  icon?: ReactElement<CIconType>;
  badge?: {
    color: string;
    text: string;
  }
  target?: string;
  href?: string;
  items?: CINavigation[];
}

let _nav: CINavigation[] = [
  {
    component: CNavItem,
    name: 'Home',
    to: '/',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '管理権限',
    role: 'admin',
  },
  {
    component: CNavItem,
    name: '管理者アカウント一覧',
    role: 'admin',
    to: '/admin/account',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
];

if (process.env.NODE_ENV === 'development') {
  const coreui_nav = await import('./AdminNavCoreUI');
  _nav = [..._nav, ...coreui_nav.default];
}

export default _nav
