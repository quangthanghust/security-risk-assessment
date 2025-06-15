import React, { useEffect, useState } from 'react';
import { getThreats, createThreat, updateThreat, deleteThreat } from '../services/threatService';
import { THREAT_OPTIONS } from '../constants/threats';

const CATEGORY_OPTIONS = Object.keys(THREAT_OPTIONS);

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

export default function ThreatPage() {
  const [threats, setThreats] = useState([]);
  const [form, setForm] = useState({
    category: CATEGORY_OPTIONS[0],
    code: '',
    description: '',
    threatLevel: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  const fetchThreats = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getThreats();
      setThreats(res.data);
    } catch {
      setErr('Không thể tải danh sách mối đe dọa');
    }
    setLoading(false);
  };

  useEffect(() => { fetchThreats(); }, []);

  // Khi đổi loại, reset code/description
  const handleCategoryChange = e => {
    const category = e.target.value;
    setForm(f => ({
      ...f,
      category,
      code: '',
      description: ''
    }));
  };

  // Khi chọn mã+desc
  const handleCodeDescChange = e => {
    const value = e.target.value;
    if (!value) {
      setForm(f => ({ ...f, code: '', description: '' }));
      return;
    }
    const [code, ...descArr] = value.split(':');
    setForm(f => ({
      ...f,
      code: code.trim(),
      description: descArr.join(':').trim()
    }));
  };

  // Khi nhập mô tả tự do (Khác)
  const handleCustomDescChange = e => {
    setForm(f => ({
      ...f,
      code: 'OTHER',
      description: e.target.value
    }));
  };

  const handleLevelChange = e => setForm(f => ({ ...f, threatLevel: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      if (editingId) {
        await updateThreat(editingId, form);
        setSuccess('Cập nhật mối đe dọa thành công!');
      } else {
        await createThreat(form);
        setSuccess('Thêm mối đe dọa thành công!');
      }
      setForm({ category: CATEGORY_OPTIONS[0], code: '', description: '', threatLevel: 1 });
      setEditingId(null);
      await fetchThreats();
    } catch {
      setErr('Lưu mối đe dọa thất bại');
    }
    setLoading(false);
  };

  const handleEdit = threat => {
    setForm({
      category: threat.category,
      code: threat.code,
      description: threat.description,
      threatLevel: threat.threatLevel
    });
    setEditingId(threat._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn chắc chắn muốn xóa mối đe dọa này?')) return;
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      await deleteThreat(id);
      setSuccess('Xóa mối đe dọa thành công!');
      await fetchThreats();
    } catch {
      setErr('Xóa thất bại');
    }
    setLoading(false);
  };

  const isOther = form.category === 'Khác';

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
          Quản lý mối đe dọa
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
            <label style={{ fontWeight: 500 }}>Loại mối đe dọa</label>
            <select name="category" value={form.category} onChange={handleCategoryChange} style={inputStyle}>
              {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mã & mô tả mối đe dọa</label>
            {!isOther ? (
              <select value={form.code ? `${form.code}: ${form.description}` : ''} onChange={handleCodeDescChange} style={inputStyle}>
                <option value="">--Chọn mối đe dọa--</option>
                {THREAT_OPTIONS[form.category].map(item => (
                  <option key={item.code} value={`${item.code}: ${item.description}`}>
                    {item.code}: {item.description}
                  </option>
                ))}
              </select>
            ) : (
              <input
                value={form.description}
                onChange={handleCustomDescChange}
                placeholder="Nhập mô tả mối đe dọa"
                style={inputStyle}
                required
              />
            )}
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mức độ đe dọa<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#666' }}>(1: Nhẹ nhất, 5: Nặng nhất)</span></label>
            <input
              name="threatLevel"
              type="number"
              min={1}
              max={5}
              value={form.threatLevel}
              onChange={handleLevelChange}
              placeholder="1-5"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 22 }}>
            <button type="submit" style={{ background: '#33FFCC', color: '#fff', padding: '6px 16px', borderRadius: 8, flex: 1 }}>{editingId ? 'Cập nhật' : 'Thêm'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ category: CATEGORY_OPTIONS[0], code: '', description: '', threatLevel: 1 }); }} style={{ background: '#AAAAAA', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Hủy</button>}
            <button type="button" onClick={fetchThreats} style={{ background: '#19c6e6', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Làm mới danh sách</button>
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
          <table className="table-main" style={{ minWidth: 900, width: '100%' }}>
            <thead>
              <tr>
                <th>Loại</th>
                <th>Mã</th>
                <th>Mô tả</th>
                <th>Mức độ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {threats.map(threat => (
                <tr key={threat._id}>
                  <td>{threat.category}</td>
                  <td>{threat.code}</td>
                  <td>{threat.description}</td>
                  <td>{threat.threatLevel}</td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleEdit(threat)} style={{ background: '#19c6e6', color: '#fff', padding: '6px 16px', borderRadius: 8, marginRight: 6, minWidth: 56 }}>Sửa</button>
                    <button onClick={() => handleDelete(threat._id)} style={{ background: '#ff4d4f', color: '#fff', padding: '6px 16px', borderRadius: 8, minWidth: 56 }}>Xóa</button>
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