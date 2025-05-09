import React from 'react'
import { useSelector, useDispatch } from 'react-redux'

import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AppSidebarNav } from './AppSidebarNav'

import { logo } from '../assets/brand/logo'
import { logo_narrow } from '../assets/brand/logo_narrow'

// sidebar nav config
import navigation from '@/Components/AdminNav'
import useGlobalConstantsContext from '@/Contexts/GlobalConstants'


export type SideBarState = {
  sidebarUnfoldable: boolean;
  sidebarShow: boolean;
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state: SideBarState) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state: SideBarState) => state.sidebarShow)

  const {globalConstants} = useGlobalConstantsContext()
  const { ADMIN_PATH } = globalConstants; 
  
  navigation.map((item, index) => {
    if (item.href && !item.href.startsWith(ADMIN_PATH)) {
      item.href = ADMIN_PATH + item.href
    }
    if (item.items) {
      item.items.map((_item, _index) => {
        if (_item.href && !_item.href.startsWith(ADMIN_PATH)) {
          _item.href = ADMIN_PATH + _item.href
        }
      })
    }
  })


  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">
        <CSidebarBrand>
          <CIcon customClassName="sidebar-brand-full" icon={logo()} height={32} />
          <CIcon customClassName="sidebar-brand-narrow" icon={logo_narrow()} height={32} />
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
