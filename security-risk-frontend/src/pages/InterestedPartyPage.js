import React, { useEffect, useState } from 'react';
import {
  getInterestedParties,
  createInterestedParty,
  updateInterestedParty,
  deleteInterestedParty,
  exportInterestedPartiesExcel,
  importInterestedPartiesExcel
} from '../services/interestedPartyService';
import moment from 'moment-timezone';

const inputStyle = {
  borderRadius: 8,
  border: '1px solid #e0e0e0',
  background: '#f7fafd',
  padding: '8px 12px',
  fontSize: 15,
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};

export default function InterestedPartyPage() {
  const [interestedParties, setInterestedParties] = useState([]);
  const [form, setForm] = useState({
    name: '',
    organization: '',
    position: '',
    address: '',
    phone: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  const fetchInterestedParties = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getInterestedParties();
      setInterestedParties(res.data);
    } catch {
      setErr('Không thể tải danh sách bên liên quan');
    }
    setLoading(false);
  };

  useEffect(() => { fetchInterestedParties(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      if (editingId) {
        await updateInterestedParty(editingId, form);
        setSuccess('Cập nhật bên liên quan thành công!');
      } else {
        await createInterestedParty(form);
        setSuccess('Thêm bên liên quan thành công!');
      }
      setForm({ name: '', organization: '', position: '', address: '', phone: '' });
      setEditingId(null);
      await fetchInterestedParties();
    } catch {
      setErr('Lưu bên liên quan thất bại');
    }
    setLoading(false);
  };

  const handleEdit = p => {
    setForm({
      name: p.name,
      organization: p.organization,
      position: p.position,
      address: p.address,
      phone: p.phone
    });
    setEditingId(p._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn chắc chắn muốn xóa bên liên quan này?')) return;
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      await deleteInterestedParty(id);
      setSuccess('Xóa bên liên quan thành công!');
      await fetchInterestedParties();
    } catch {
      setErr('Xóa thất bại');
    }
    setLoading(false);
  };

  const filteredParties = interestedParties.filter(p => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return (
      p.name?.toLowerCase().includes(keyword) ||
      p.organization?.toLowerCase().includes(keyword) ||
      p.position?.toLowerCase().includes(keyword) ||
      p.address?.toLowerCase().includes(keyword) ||
      p.phone?.toLowerCase().includes(keyword)
    );
  });


  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#f7fafd',
        padding: 0,
        margin: 0
      }}
    >
      <div
        style={{
          width: '100%',
          padding: '40px 0 0 0',
          boxSizing: 'border-box'
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
          Quản lý các bên liên quan
        </h2>
        {loading && <div style={{ color: '#19c6e6', marginBottom: 12 }}>Đang tải dữ liệu...</div>}
        {err && <div style={{ color: 'red', marginBottom: 8 }}>{err}</div>}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 24,
            margin: '0 32px 24px 32px',
            alignItems: 'end',
            background: '#fff',
            borderRadius: 8,
            padding: 24,
            boxShadow: '0 2px 8px #0001'
          }}
        >
          <div>
            <label style={{ fontWeight: 500 }}>Tên</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Tên" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Tổ chức</label>
            <input name="organization" value={form.organization} onChange={handleChange} placeholder="Tổ chức" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Chức vụ</label>
            <input name="position" value={form.position} onChange={handleChange} placeholder="Chức vụ" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Địa chỉ</label>
            <input name="address" value={form.address} onChange={handleChange} placeholder="Địa chỉ" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Số điện thoại</label>
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 22 }}>
            <button type="submit" style={{ background: '#33FFCC', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>{editingId ? 'Cập nhật' : 'Thêm'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', organization: '', position: '', address: '', phone: '' }); }} style={{ background: '#AAAAAA', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Hủy</button>}
            <button type="button" onClick={fetchInterestedParties} style={{ background: '#19c6e6', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Làm mới danh sách</button>
          </div>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '0 32px 12px 32px',
          justifyContent: 'flex-start'
        }}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, tổ chức, chức vụ, địa chỉ, SĐT..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: 350,
              padding: '8px 14px',
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              fontSize: 15,
              background: '#f7fafd'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 16,
          marginLeft: 32,
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={async () => {
              try {
                const res = await exportInterestedPartiesExcel();
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'cac_ben_lien_quan.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
              } catch (err) {
                alert('Xuất Excel thất bại!');
              }
            }}
            style={{
              background: '#19c6e6',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: 8
            }}
          >
            Xuất Excel
          </button>
          <label
            htmlFor="import-interested-party-excel"
            style={{
              background: '#27ae60',
              color: '#fff',
              padding: '6px 16px',
              borderRadius: 8,
              cursor: 'pointer',
              display: 'inline-block'
            }}
          >
            Thêm tệp
            <input
              id="import-interested-party-excel"
              type="file"
              accept=".xlsx, .xls"
              onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  await importInterestedPartiesExcel(formData);
                  alert('Import thành công!');
                  fetchInterestedParties(); // reload lại danh sách
                } catch (err) {
                  alert('Import thất bại!');
                }
              }}
              style={{ display: 'none' }}
            />
          </label>
        </div>

        <div style={{
          margin: '0 32px 32px 32px',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
          padding: 0,
          overflowX: 'auto'
        }}>
          <table className="table-main" style={{ minWidth: 900, width: '100%' }}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Tổ chức</th>
                <th>Chức vụ</th>
                <th>Địa chỉ</th>
                <th>Số điện thoại</th>
                <th>Thời gian tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredParties.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.organization}</td>
                  <td>{p.position}</td>
                  <td>{p.address}</td>
                  <td>{p.phone}</td>
                  <td>
                    {p.updatedAt
                      ? moment(p.updatedAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
                      : (p.createdAt
                        ? moment(p.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
                        : '')
                    }
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleEdit(p)} style={{ background: '#19c6e6', color: '#fff', padding: '6px 16px', borderRadius: 8, marginRight: 6, minWidth: 56 }}>Sửa</button>
                    <button onClick={() => handleDelete(p._id)} style={{ background: '#ff4d4f', color: '#fff', padding: '6px 16px', borderRadius: 8, minWidth: 56 }}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}