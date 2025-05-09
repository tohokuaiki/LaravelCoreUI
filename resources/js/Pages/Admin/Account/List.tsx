import Util, { CONSTANT, getDefaultUser } from '@/lib/util';
import { User } from '@/types/index';
import { CCard, CCardHeader, CCardBody, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow, CButton, CBadge } from '@coreui/react';
import { Head } from '@inertiajs/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import useGlobalConstantsContext from '@/Contexts/GlobalConstants';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import axios from 'axios';
import { cilPencil } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CellContext, ColumnDef, createColumnHelper, flexRender, PaginationState, SortingState } from '@tanstack/react-table';
import { TanStackPagination, TanStackSortingButton } from '@/Components/TanStackUtils';
import { getInitialSorting, getInitialPagination, useTanStackSortableTable } from '@/hooks/useTanStackSortableTable';
import { DateTimeString, Role } from '@/types/app';
import { DateTime } from 'luxon';


export default function List(): ReactNode {

    const [users, setUsers] = useState<User[]>([]);

    const { globalConstants } = useGlobalConstantsContext()
    const { config } = globalConstants;
    const bodyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        (async () => {
            const resp = await axios.get(route('users.index'))
            if (resp.status === 200) {
                const _users: User[] = [];
                (resp.data as User[]).forEach((user, i) => {
                    Util.castDates(user, ['last_login_at', 'email_verified_at']);
                    _users[i] = user;
                })
                setUsers(_users);
            }
        })()
    }, [])
    const [sorting, setSorting] = useState<SortingState>(getInitialSorting());
    const [pagination, setPagination] = useState<PaginationState>(getInitialPagination(config.pagination.perpage));
    const columnHelper = createColumnHelper<User>();
    const columns: (ColumnDef<User, number> | ColumnDef<User, string> | ColumnDef<User, Role[]> | ColumnDef<User, Date>)[] = [
        columnHelper.accessor('id', {
            header: TanStackSortingButton<User, number>("ID", setSorting)
        }),
        columnHelper.accessor('name', {
            header: TanStackSortingButton<User, string>("アカウント名", setSorting),
        }),
        columnHelper.accessor('roles', {
            header: 'ロール',
            cell: (props: CellContext<User, Role[]>) => (<ul>{(props.getValue()).map((role, index) =>
                <CBadge key={index} color="success" shape="rounded-pill" className='me-1'>{role.name}</CBadge>
            )}</ul>)
        }),
        columnHelper.accessor('email', {
            header: TanStackSortingButton<User, string>('メールアドレス', setSorting)
        }),
        columnHelper.accessor('last_login_at', {
            header: TanStackSortingButton<User, Date | null>('最終ログイン', setSorting),
            cell: (props) => {
                const prop = props.getValue();
                return prop ? DateTime.fromJSDate(prop).toFormat(CONSTANT.FORMAT_DATETIME) : "-";
            }

        }),
        columnHelper.accessor('created_at', {
            header: TanStackSortingButton<User, Date>('作成日時', setSorting),
            cell: (props) => <>{DateTime.fromJSDate(props.getValue()).toFormat(CONSTANT.FORMAT_DATETIME)}</>
        }),
        columnHelper.accessor('updated_at', {
            header: TanStackSortingButton<User, Date>('更新日時', setSorting),
            cell: (props) => <>{DateTime.fromJSDate(props.getValue()).toFormat(CONSTANT.FORMAT_DATETIME)}</>
        }),
        columnHelper.display({
            id: 'actions',
            header: '操作',
            cell: (props: CellContext<User, unknown>) => (<div className='text-nowrap'>
                <CButton size="sm" color='primary' className="mr-2" onClick={() => openEditModal(users[props.row.index])}>編集</CButton>
                <CButton size="sm" color='danger' onClick={() => openDeleteModal(users[props.row.index])}>削除</CButton>
            </div>)
        })
    ];
    const table = useTanStackSortableTable({
        data: users,
        columns,
        state: { pagination, sorting }
    });

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
                    {users.length > 0 ? <>
                    <TanStackPagination table={table} onClick={Util.returnTop} className='mb-2' setPagination={setPagination} />
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
                    <TanStackPagination table={table} onClick={Util.returnTop} className="mt-2" setPagination={setPagination} /></>
                     : "登録されているアカウントはありません。"}
                </CCardBody>
            </CCard>
        </>
    )
}
