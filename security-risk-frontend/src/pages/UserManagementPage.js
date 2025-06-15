import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import moment from 'moment-timezone';
import 'moment/locale/vi';

export default function UserManagementPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await api.get(`/users?search=${searchTerm}`);
            setUsers(res.data);
            setError('');
        } catch (err) {
            setError('Không thể tải danh sách người dùng');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchTerm]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers();
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
            try {
                await api.delete(`/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (err) {
                setError('Không thể xóa người dùng');
                console.error(err);
            }
        }
    };

    return (
        <div
            style={{
                width: '100%',
                minHeight: '100vh',
                background: '#fff0f6',
                padding: 0,
                margin: 0
            }}
        >
            <h2 style={{
                color: '#19c6e6',
                fontWeight: 700,
                fontSize: 32,
                marginBottom: 32,
                letterSpacing: 0.5,
                marginLeft: 32
            }}>
                Quản lý tài khoản
            </h2>

            <div style={{ margin: '0 32px 16px 32px' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', marginBottom: 16 }}>
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên đăng nhập"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        style={{
                            padding: 8,
                            borderRadius: 8,
                            border: '1px solid #e0e0e0',
                            marginRight: 8,
                            flex: 1,
                            maxWidth: 300
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: '8px 16px',
                            background: '#19c6e6',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 8,
                            cursor: 'pointer'
                        }}
                    >
                        Tìm kiếm
                    </button>
                </form>

                {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
                {loading ? (
                    <div>Đang tải...</div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
                            <thead>
                                <tr style={{ background: '#eee' }}>
                                    <th style={{ padding: 10 }}>ID</th>
                                    <th style={{ padding: 10 }}>Tên đăng nhập</th>
                                    <th style={{ padding: 10 }}>Email</th>
                                    <th style={{ padding: 10 }}>Vai trò</th>
                                    <th style={{ padding: 10 }}>Thời gian đăng ký</th>
                                    <th style={{ padding: 10 }}>Thời gian đăng nhập cuối</th>
                                    <th style={{ padding: 10 }}>Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => (
                                    <tr key={user._id}>
                                        <td style={{ padding: 8 }}>{user._id}</td>
                                        <td style={{ padding: 8 }}>{user.username}</td>
                                        <td style={{ padding: 8 }}>{user.email}</td>
                                        <td style={{ padding: 8 }}>{user.role === 'admin' ? 'Admin' : 'Người dùng'}</td>
                                        <td style={{ padding: 8 }}>
                                            {user.createdAt ? moment(user.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss') : ''}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            {user.lastLogin ? moment(user.lastLogin).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss') : 'Chưa đăng nhập'}
                                        </td>
                                        <td style={{ padding: 8 }}>
                                            <button
                                                onClick={() => handleDeleteUser(user._id)}
                                                style={{
                                                    padding: '6px 12px',
                                                    background: '#ff4d4f',
                                                    color: '#fff',
                                                    border: 'none',
                                                    borderRadius: 6,
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                Xóa
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}