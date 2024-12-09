import Util, { getDefaultUser } from '@/lib/util';
import { User } from '@/types/index';
import { CCard, CCardHeader, CCardBody, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CBadge } from '@coreui/react';
import { Head } from '@inertiajs/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import useGlobalConstantsContext from '@/Contexts/GlobalConstants';
import { useLocation } from 'react-router-dom';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, Table, useReactTable } from '@tanstack/react-table';
import {TanStackPagination , tanStackSortableHeader} from '@/Components/TanStackUtils';


export default function List(): ReactNode {

    const [users, setUsers] = useState<User[]>([]);

    const { globalConstants } = useGlobalConstantsContext()
    const { config } = globalConstants;
    const bodyRef = useRef<HTMLDivElement>(null);

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
    const initialPage: number = p > 0 ? p - 1 : 0
    const perPage: number = config.pagination.perpage

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
        bodyRef.current?.focus({ preventScroll: true });
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
        bodyRef.current?.focus({ preventScroll: true });
        setDeleteUserModal(false)
    }

    const columnHelper = createColumnHelper<User>();
    const columns = [
        columnHelper.accessor('id', {
            header: tanStackSortableHeader("ID")
        }),
        columnHelper.accessor('name', {
            header: tanStackSortableHeader("アカウント名")
        }),
        columnHelper.accessor('roles', {
            header: 'ロール',
            cell: (props) => (<ul>{props.getValue().map((role, index) =>
                <CBadge key={index} color="success" shape="rounded-pill" className='me-1'>{role.name}</CBadge>
            )}</ul>)
        }),
        columnHelper.accessor('email', {
            header: tanStackSortableHeader('メールアドレス')
        }),
        columnHelper.accessor('last_login_at', {
            header: tanStackSortableHeader('最終ログイン'),
            cell: (props) => <>{props.getValue() ? Util.datetime(props.getValue()).toFormat('yyyy/MM/dd HH:mm') : ''}</>
        }),
        columnHelper.accessor('created_at', {
            header: tanStackSortableHeader('作成日時'),
            cell: (props) => <>{Util.datetime(props.getValue()).toFormat('yyyy/MM/dd HH:mm')}</>
        }),
        columnHelper.accessor('updated_at', {
            header: tanStackSortableHeader('更新日時'),
            cell: (props) => <>{Util.datetime(props.getValue()).toFormat('yyyy/MM/dd HH:mm')}</>
        }),
        columnHelper.display({
            id: 'actions',
            header: '操作',
            cell: (props) => (<>
                <CButton color='primary' className="mr-2" onClick={() => openEditModal(users[props.row.index])}>編集</CButton>
                <CButton color='danger' onClick={() => openDeleteModal(users[props.row.index])}>削除</CButton>
            </>)
        })
    ];
    const table: Table<User> = useReactTable({
        data: users,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        initialState: {
            pagination: {
                pageIndex: initialPage,
                pageSize: perPage,
            },
            sorting: [{ id: "id", desc: false }],
        }
    });

    return (
        <>
            <Head title="管理者アカウント" />
            <EditModal user={editUser} isVisible={editUserModal} closeHandler={closeEditModal} updateHandler={updateUserHandler} />
            <DeleteModal user={deleteUser} isVisible={deleteUserModal} closeHandler={closeDeleteModal} deleteHandler={deleteUserHandler} />
            <CCard className="mb-4" tabIndex={0} ref={bodyRef}>
                <CCardHeader>
                    管理者アカウント一覧
                    <CButton color="warning" className="float-end" size="sm" onClick={() => openEditModal(getDefaultUser())}>
                        <CIcon icon={cilPencil} />新規作成
                    </CButton>
                </CCardHeader>
                <CCardBody>
                    <TanStackPagination table={table} onClick={Util.returnTop} className='mb-2' />
                    <CTable className='text-center'>
                        <CTableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <CTableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <CTableHeaderCell key={header.id}>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </CTableHeaderCell>
                                    ))}
                                </CTableRow>
                            ))}
                        </CTableHead>
                        <CTableBody>
                            {table.getRowModel().rows.map((row) => (
                                <CTableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <CTableDataCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </CTableDataCell>
                                    ))}
                                </CTableRow>
                            ))}
                        </CTableBody>
                    </CTable>
                    <TanStackPagination table={table} onClick={Util.returnTop} className="mt-2" />
                </CCardBody>
            </CCard>
        </>
    )
}
