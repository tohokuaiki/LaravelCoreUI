import Util from '@/lib/util';
import { User } from '@/types/index';
import { CCard, CCardHeader, CCardBody, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CBadge } from '@coreui/react';
import { Head } from '@inertiajs/react';
import { ReactNode, useEffect, useState } from 'react';
import useGlobalConstantsContext from '@/Contexts/GlobalConstants';
import { useLocation, useNavigate } from 'react-router-dom';
import MyRcPager from '@/Components/Pager';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

export const getDefaultUser = (): User => {
    return {
        id: 0, name: "", email: "", password: "",
        roles: [],
        email_verified_at: "0000-00-00 00:00:00", created_at: "0000-00-00 00:00:00", updated_at: "0000-00-00 00:00:00"
    };
}

export default function List(): ReactNode {

    const [users, setUsers] = useState<User[]>([]);

    const { globalConstants } = useGlobalConstantsContext()
    const { config } = globalConstants;

    useEffect(() => {
        (async () => {
            const resp = await axios.get(route('users.index'))
            if (resp.status === 200) {
                setUsers(resp.data as User[])
            }
        })()
    }, [])

    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const pathname = location.pathname
    const p: number = Number(searchParams.get('page'))
    const initialPage: number = p ? p : 1
    const [page, setPage] = useState(initialPage)
    const perPage: number = config.pagination.perpage
    const navigate = useNavigate()


    const pageChange = (_page: number) => {
        if (_page != page) {
            setPage(_page)
            const params = new URLSearchParams(searchParams);
            params.set('page', _page.toString())
            const queryString = params.toString();
            const updatedPath = queryString ? `${pathname}?${queryString}` : pathname;
            navigate(updatedPath)
            Util.returnTop()
        }
    }

    const selectedUsers: User[] = users.slice((page - 1) * perPage, page * perPage);

    //  編集 
    const [editUser, setEditUser] = useState<User>(getDefaultUser())
    const [editUserModal, setEditUserModal] = useState<boolean>(false)
    const openEditModal = (user: User) => {
        setEditUser(user)
        setEditUserModal(true)
    }
    const updateUserHandler = (user: User, isNew: boolean) => {
        setEditUserModal(false)
        if (isNew) {
            setUsers([...users, user])
        } else {
            setUsers(users.map((_user, index) => _user.id === user.id ? user : _user))
        }
    }
    const closeEditModal = () => {
        setEditUserModal(false)

    }

    // 削除
    const [deleteUser, setDeleteUser] = useState<User>(getDefaultUser())
    const [deleteUserModal, setDeleteUserModal] = useState<boolean>(false)
    const openDeleteModal = (user: User) => {
        setDeleteUser(user)
        setDeleteUserModal(true)
    }
    const deleteUserHandler = () => {
        setUsers(users.filter((_user, index) => _user.id !== deleteUser.id))
        setDeleteUserModal(false)
    }
    const closeDeleteModal = () => {
        setDeleteUserModal(false)
    }
    route()

    return (
        <>
            <Head title="管理者アカウント" />
            <EditModal user={editUser} isVisible={editUserModal} closeHandler={closeEditModal} updateHandler={updateUserHandler} />
            <DeleteModal user={deleteUser} isVisible={deleteUserModal} closeHandler={closeDeleteModal} deleteHandler={deleteUserHandler} />
            <CCard className="mb-4">
                <CCardHeader>
                    管理者アカウント一覧
                    <CButton color="warning" className="float-end" size="sm" onClick={() => openEditModal(getDefaultUser())}>
                        <CIcon icon={cilPencil} />新規作成
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <MyRcPager
                        defaultCurrent={page}
                        current={page}
                        onChange={pageChange}
                        pageSize={perPage}
                        total={users.length}
                    />
                    <CTable>
                        <CTableHead>
                            <CTableRow>
                                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                <CTableHeaderCell scope="col">アカウント名</CTableHeaderCell>
                                <CTableHeaderCell scope="col">ロール</CTableHeaderCell>
                                <CTableHeaderCell scope="col">メールアドレス</CTableHeaderCell>
                                <CTableHeaderCell scope="col">作成日時</CTableHeaderCell>
                                <CTableHeaderCell scope="col">更新日時</CTableHeaderCell>
                                <CTableHeaderCell scope="col">操作</CTableHeaderCell>
                            </CTableRow>
                        </CTableHead>
                        <CTableBody>
                            {selectedUsers.map((user, index) => (
                                <CTableRow key={index}>
                                    <CTableHeaderCell scope="row">{user.id}</CTableHeaderCell>
                                    <CTableDataCell>{user.name}</CTableDataCell>
                                    <CTableDataCell><ul>{user.roles.map((role, index) =>
                                        <CBadge key={index} color="success" shape="rounded-pill">{role.name}</CBadge>
                                    )}</ul></CTableDataCell>
                                    <CTableDataCell>{user.email}</CTableDataCell>
                                    <CTableDataCell>{Util.datetime(user.created_at).toFormat('yyyy/MM/dd HH:mm:ss')}</CTableDataCell>
                                    <CTableDataCell>{Util.datetime(user.updated_at).toFormat('yyyy/MM/dd HH:mm:ss')}</CTableDataCell>
                                    <CTableDataCell>
                                        <CButton color='primary' className="mr-2" onClick={() => openEditModal(user)}>編集</CButton>
                                        <CButton color='danger' onClick={() => openDeleteModal(user)}>削除</CButton>
                                    </CTableDataCell>
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                    <MyRcPager
                        defaultCurrent={page}
                        current={page}
                        onChange={pageChange}
                        pageSize={perPage}
                        total={users.length}
                    />
                </CCardBody>
            </CCard>
        </>
    )
}
