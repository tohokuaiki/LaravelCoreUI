import React, { Suspense } from 'react'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '@/routes/admin'
import useGlobalConstantsContext from '@/Contexts/GlobalConstants'
import Page404 from '@/Pages/Admin/Page404'
import { usePathname } from '@/hooks/useInertiaPage'
import Home from '@/Pages/Admin/Home'

const AppContent = () => {

  const { globalConstants } = useGlobalConstantsContext()
  const { ADMIN_PATH } = globalConstants;
  const pathname = usePathname();
  const route = routes.find(route => ADMIN_PATH + route.path === pathname);
  
  return (
    <CContainer fluid={true} className="px-4">
      <Suspense fallback={<CSpinner color="primary" />}>
        {route ? <route.element /> : <Page404 />}
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
