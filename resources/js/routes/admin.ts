import { RouteProp } from '@/types/coreui'
import React from 'react'

const Home = React.lazy(()=> import ('@/Pages/Admin/Home'))
const AdminAccountList = React.lazy(()=> import ('@/Pages/Admin/Account/List'))
const Profile = React.lazy(()=> import ('@/Pages/Admin/Profile'))

const routes:RouteProp[] = [
  { path: '/', name: 'Top', element: Home },
  { path: '/admin/account', name: '管理者アカウント', element: AdminAccountList },
  { path: '/profile', name: 'アカウント情報', element: Profile },
]

if (process.env.NODE_ENV === 'development') {
  const coreuiRoutes = await import('./coreui');
  routes.push(...coreuiRoutes.default);
}

export default routes;
