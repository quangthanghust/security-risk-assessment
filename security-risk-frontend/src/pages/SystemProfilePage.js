import React, { useEffect, useState } from 'react';
import {
  getSystemProfiles,
  createSystemProfile,
  updateSystemProfile,
  deleteSystemProfile
} from '../services/systemProfileService';
import moment from 'moment-timezone';

const CRITICALITY_OPTIONS = ['Rất quan trọng', 'Quan trọng', 'Bình thường'];

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

export default function SystemProfilePage() {
  const [profiles, setProfiles] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    manager: '',
    contact: '',
    purpose: '',
    scope: '',
    criticality: 'Bình thường',
    organizationUnit: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfiles = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getSystemProfiles();
      setProfiles(res.data);
    } catch {
      setErr('Không thể tải danh sách hệ thống');
    }
    setLoading(false);
  };

  useEffect(() => { fetchProfiles(); }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      if (editingId) {
        await updateSystemProfile(editingId, form);
        setSuccess('Cập nhật hệ thống thành công!');
      } else {
        await createSystemProfile(form);
        setSuccess('Thêm hệ thống thành công!');
      }
      setForm({
        name: '',
        description: '',
        manager: '',
        contact: '',
        purpose: '',
        scope: '',
        criticality: 'Bình thường',
        organizationUnit: ''
      });
      setEditingId(null);
      await fetchProfiles();
    } catch {
      setErr('Lưu hệ thống thất bại');
    }
    setLoading(false);
  };

  const handleEdit = p => {
    setForm({
      name: p.name,
      description: p.description,
      manager: p.manager,
      contact: p.contact,
      purpose: p.purpose,
      scope: p.scope,
      criticality: p.criticality,
      organizationUnit: p.organizationUnit
    });
    setEditingId(p._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn chắc chắn muốn xóa hệ thống này?')) return;
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      await deleteSystemProfile(id);
      setSuccess('Xóa hệ thống thành công!');
      await fetchProfiles();
    } catch {
      setErr('Xóa thất bại');
    }
    setLoading(false);
  };

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
          Quản lý hồ sơ hệ thống
        </h2>
        {loading && <div style={{ color: '#19c6e6', marginBottom: 12 }}>Đang tải dữ liệu...</div>}
        {err && <div style={{ color: 'red', marginBottom: 8 }}>{err}</div>}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
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
            <label style={{ fontWeight: 500 }}>Tên hệ thống</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Tên hệ thống" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Người quản lý</label>
            <input name="manager" value={form.manager} onChange={handleChange} placeholder="Người quản lý" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Liên hệ</label>
            <input name="contact" value={form.contact} onChange={handleChange} placeholder="Email/SĐT" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Đơn vị phụ trách</label>
            <input name="organizationUnit" value={form.organizationUnit} onChange={handleChange} placeholder="Phòng ban/Đơn vị" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mục đích sử dụng</label>
            <input name="purpose" value={form.purpose} onChange={handleChange} placeholder="Mục đích sử dụng" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Phạm vi hệ thống</label>
            <input name="scope" value={form.scope} onChange={handleChange} placeholder="Phạm vi hệ thống" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mức độ quan trọng</label>
            <select name="criticality" value={form.criticality} onChange={handleChange} style={inputStyle}>
              {CRITICALITY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mô tả</label>
            <input name="description" value={form.description} onChange={handleChange} placeholder="Mô tả hệ thống" style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 22 }}>
            <button type="submit" style={{ background: '#33FFCC', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>{editingId ? 'Cập nhật' : 'Thêm'}</button>
            {editingId && <button type="button" onClick={() => {
              setEditingId(null);
              setForm({
                name: '',
                description: '',
                manager: '',
                contact: '',
                purpose: '',
                scope: '',
                criticality: 'Bình thường',
                organizationUnit: ''
              });
            }} style={{ background: '#AAAAAA', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Hủy</button>}
          </div>
        </form>

        {/* BẢNG */}
        <div style={{
          margin: '0 32px 32px 32px',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
          padding: 0,
          overflowX: 'auto'
        }}>
          <table className="table-main" style={{ minWidth: 1200, width: '100%' }}>
            <thead>
              <tr>
                <th>Tên hệ thống</th>
                <th>Người quản lý</th>
                <th>Liên hệ</th>
                <th>Đơn vị phụ trách</th>
                <th>Mục đích</th>
                <th>Phạm vi</th>
                <th>Mức độ quan trọng</th>
                <th>Mô tả</th>
                <th>Thời gian tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(p => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.manager}</td>
                  <td>{p.contact}</td>
                  <td>{p.organizationUnit}</td>
                  <td>{p.purpose}</td>
                  <td>{p.scope}</td>
                  <td>{p.criticality}</td>
                  <td>{p.description}</td>
                  <td>
                    {p.createdAt
                      ? moment(p.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
                      : ''}
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleEdit(p)}
                      style={{
                        background: '#19c6e6',
                        color: '#fff',
                        padding: '6px 16px',
                        borderRadius: 8,
                        marginRight: 6,
                        minWidth: 56
                      }}
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      style={{
                        background: '#ff4d4f',
                        color: '#fff',
                        padding: '6px 16px',
                        borderRadius: 8,
                        minWidth: 56
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
      </div>
    </div>
  );
}