import {
    CCol,
    CContainer,
    CRow,
} from '@coreui/react'
import { Head } from '@inertiajs/react'

const Page404 = () => {
    return (
        <div className="bg-body-tertiary d-flex flex-row align-items-center mt-10">
            <Head title="404 Not Found" />
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={6}>
                        <div className="clearfix">
                            <h1 className="float-start display-3 me-4">404</h1>
                            <h4 className="pt-3">ページが存在しません。</h4>
                            <p className="text-body-secondary float-start">
                                指定したURLのページは存在しません。
                            </p>
                        </div>
                    </CCol>
                </CRow>
            </CContainer>
        </div>
    )
}

export default Page404
