import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'

// routes config
import routes from '@/routes/admin'
import useGlobalConstantsContext from '@/Contexts/GlobalConstants'

const AppContent = () => {

  const {globalConstants} = useGlobalConstantsContext()
  const { ADMIN_PATH } = globalConstants; 

  return (
    <CContainer className="px-4">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={ADMIN_PATH + route.path}
                  element={<route.element />}
                />
              )
            )
          })}
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
