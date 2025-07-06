import React, { useEffect, useState } from 'react';
import { getStrategicScenarios, createStrategicScenario, updateStrategicScenario, deleteStrategicScenario } from '../services/strategicScenarioService';
import { getAssets } from '../services/assetService';
import { getRiskSources } from '../services/riskSourceService';
import { getInterestedParties } from '../services/interestedPartyService';


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

export default function StrategicScenarioPage() {
  const [strategicScenarios, setStrategicScenarios] = useState([]);
  const [assets, setAssets] = useState([]);
  const [riskSources, setRiskSources] = useState([]);
  const [interestedParties, setInterestedParties] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    asset: '',
    riskSource: '',
    interestedParties: [],
    interestedPartiesLevel: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');

  // Bước 1: Lấy dữ liệu liên kết
  const fetchData = async () => {
    setLoading(true);
    setErr('');
    try {
      const [scRes, assetRes, rsRes, ipRes] = await Promise.all([
        getStrategicScenarios(),
        getAssets(),
        getRiskSources(),
        getInterestedParties()
      ]);
      setStrategicScenarios(scRes.data);
      setAssets(assetRes.data);
      setRiskSources(rsRes.data);
      setInterestedParties(ipRes.data);
    } catch {
      setErr('Không thể tải dữ liệu');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Bước 2: Xử lý form
  const handleChange = e => {
    const { name, value } = e.target;
    if (name === 'interestedParties') {
      setForm({ ...form, interestedParties: Array.from(e.target.selectedOptions, option => option.value) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Bước 3: CRUD
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      if (editingId) {
        await updateStrategicScenario(editingId, form);
        setSuccess('Cập nhật kịch bản chiến lược thành công!');
      } else {
        await createStrategicScenario(form);
        setSuccess('Thêm kịch bản chiến lược thành công!');
      }
      setForm({ name: '', description: '', asset: '', riskSource: '', interestedParties: [], scenarioLevel: 1 });
      setEditingId(null);
      await fetchData();
    } catch {
      setErr('Lưu kịch bản thất bại');
    }
    setLoading(false);
  };

  const handleEdit = sc => {
    setForm({
      name: sc.name,
      description: sc.description,
      asset: sc.asset?._id || sc.asset || '',
      riskSource: sc.riskSource?._id || sc.riskSource || '',
      interestedParties: (sc.interestedParties || []).map(ip => ip._id || ip),
      interestedPartiesLevel: sc.interestedPartiesLevel
    });
    setEditingId(sc._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn chắc chắn muốn xóa kịch bản này?')) return;
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      await deleteStrategicScenario(id);
      setSuccess('Xóa kịch bản thành công!');
      await fetchData();
    } catch {
      setErr('Xóa thất bại');
    }
    setLoading(false);
  };

  const filteredStrategicScenarios = strategicScenarios.filter(sc => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return true;
    return (
      sc.name?.toLowerCase().includes(keyword) ||
      sc.description?.toLowerCase().includes(keyword) ||
      assets.find(a => a._id === (sc.asset?._id || sc.asset))?.name?.toLowerCase().includes(keyword) ||
      riskSources.find(rs => rs._id === (sc.riskSource?._id || sc.riskSource))?.name?.toLowerCase().includes(keyword) ||
      (sc.interestedParties || []).some(ipId =>
        interestedParties.find(ip => ip._id === (ipId._id || ipId))?.name?.toLowerCase().includes(keyword)
      )
    );
  });

  // Bước 4: Dropdown liên kết

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
          Quản lý kịch bản chiến lược
        </h2>
        {loading && <div style={{ color: '#19c6e6', marginBottom: 12 }}>Đang tải dữ liệu...</div>}
        {err && <div style={{ color: 'red', marginBottom: 8 }}>{err}</div>}
        {success && <div style={{ color: 'green', marginBottom: 8 }}>{success}</div>}
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
            <label style={{ fontWeight: 500 }}>Tên kịch bản</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Tên kịch bản" required style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mô tả</label>
            <input name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Tài sản</label>
            <select name="asset" value={form.asset} onChange={handleChange} style={inputStyle}>
              <option value="">--Tài sản--</option>
              {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Nguồn rủi ro</label>
            <select name="riskSource" value={form.riskSource} onChange={handleChange} style={inputStyle}>
              <option value="">--Nguồn rủi ro--</option>
              {riskSources.map(rs => (
                <option key={rs._id} value={rs._id}>{rs.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Các bên liên quan</label>
            <select
              name="interestedParties"
              value={form.interestedParties}
              onChange={handleChange}
              multiple
              style={{ ...inputStyle, minHeight: 38, maxHeight: 80, overflowY: 'auto' }}
              title="Giữ Ctrl (Cmd) để chọn nhiều"
            >
              {interestedParties.map(ip => (
                <option key={ip._id} value={ip._id}>{ip.name}</option>
              ))}
            </select>
            <div style={{ fontSize: 12, color: '#666' }}>Giữ Ctrl (Cmd) để chọn nhiều</div>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mức độ nghiêm trọng<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#666' }}>(1: Thấp nhất, 5: Cao nhất)</span></label>
            <input
              name="interestedPartiesLevel"
              type="number"
              min={1}
              max={5}
              value={form.interestedPartiesLevel}
              onChange={handleChange}
              placeholder="1-5"
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 22 }}>
            <button type="submit" style={{ background: '#33FFCC', color: '#fff', padding: '6px 16px', borderRadius: 8, flex: 1 }}>{editingId ? 'Cập nhật' : 'Thêm'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', asset: '', riskSource: '', interestedParties: [], scenarioLevel: 1 }); }} style={{ background: '#AAAAAA', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Hủy</button>}
            <button type="button" onClick={fetchData} style={{ background: '#19c6e6', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Làm mới danh sách</button>
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
            placeholder="Tìm kiếm theo tên, mô tả, tài sản, nguồn rủi ro, bên liên quan..."
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
          margin: '0 32px 32px 32px',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
          padding: 0,
          overflowX: 'auto'
        }}>
          <table className="table-main" style={{ minWidth: 1000, width: '100%' }}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Mô tả</th>
                <th>Tài sản</th>
                <th>Nguồn rủi ro</th>
                <th>Các bên liên quan</th>
                <th>Mức độ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredStrategicScenarios.map(sc => (
                <tr key={sc._id}>
                  <td>{sc.name}</td>
                  <td>{sc.description}</td>
                  <td>{assets.find(a => a._id === (sc.asset?._id || sc.asset))?.name || ''}</td>
                  <td>{riskSources.find(rs => rs._id === (sc.riskSource?._id || sc.riskSource))?.name || ''}</td>
                  <td>
                    {(sc.interestedParties || []).map(ipId =>
                      interestedParties.find(ip => ip._id === (ipId._id || ipId))?.name
                    ).filter(Boolean).join(', ')}
                  </td>
                  <td>{sc.interestedPartiesLevel}</td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button onClick={() => handleEdit(sc)} style={{ background: '#19c6e6', color: '#fff', padding: '6px 16px', borderRadius: 8, marginRight: 6, minWidth: 56 }}>Sửa</button>
                    <button onClick={() => handleDelete(sc._id)} style={{ background: '#ff4d4f', color: '#fff', padding: '6px 16px', borderRadius: 8, minWidth: 56 }}>Xóa</button>
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