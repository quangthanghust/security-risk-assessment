import React, { useEffect, useState } from 'react';
import { getOperationScenarios, createOperationScenario, updateOperationScenario, deleteOperationScenario } from '../services/operationScenarioService';
import { getStrategicScenarios } from '../services/strategicScenarioService';
import { getAssets } from '../services/assetService';
import { getThreats } from '../services/threatService';
import { getVulnerabilities } from '../services/vulnerabilityService';


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

export default function OperationScenarioPage() {
  const [operationScenarios, setOperationScenarios] = useState([]);
  const [strategicScenarios, setStrategicScenarios] = useState([]);
  const [assets, setAssets] = useState([]);
  const [threats, setThreats] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    strategicScenarioId: '',
    asset: '',
    threat: '',
    vulnerability: '',
    controlEffectiveness: 1,
    detectability: 1,
    exposureFrequency: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  // Bước 1: Lấy dữ liệu liên kết
  const fetchData = async () => {
    setLoading(true);
    setErr('');
    try {
      const [osRes, ssRes, assetRes, threatRes, vulnRes] = await Promise.all([
        getOperationScenarios(),
        getStrategicScenarios(),
        getAssets(),
        getThreats(),
        getVulnerabilities()
      ]);
      setOperationScenarios(osRes.data);
      setStrategicScenarios(ssRes.data);
      setAssets(assetRes.data);
      setThreats(threatRes.data);
      setVulnerabilities(vulnRes.data);
    } catch {
      setErr('Không thể tải dữ liệu');
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  // Bước 2: Xử lý form
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  // Bước 3: CRUD
  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      if (editingId) {
        await updateOperationScenario(editingId, form);
        setSuccess('Cập nhật kịch bản vận hành thành công!');
      } else {
        await createOperationScenario(form);
        setSuccess('Thêm kịch bản vận hành thành công!');
      }
      setForm({
        name: '',
        description: '',
        strategicScenarioId: '',
        asset: '',
        threat: '',
        vulnerability: '',
        controlEffectiveness: 1,
        detectability: 1,
        exposureFrequency: 1
      });
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
      strategicScenarioId: sc.strategicScenarioId?._id || sc.strategicScenarioId || '',
      asset: sc.asset?._id || sc.asset || '',
      threat: sc.threat?._id || sc.threat || '',
      vulnerability: sc.vulnerability?._id || sc.vulnerability || '',
      controlEffectiveness: sc.controlEffectiveness,
      detectability: sc.detectability,
      exposureFrequency: sc.exposureFrequency
    });
    setEditingId(sc._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn chắc chắn muốn xóa kịch bản này?')) return;
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      await deleteOperationScenario(id);
      setSuccess('Xóa kịch bản thành công!');
      await fetchData();
    } catch {
      setErr('Xóa thất bại');
    }
    setLoading(false);
  };

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
          Quản lý kịch bản vận hành
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
            <label style={{ fontWeight: 500 }}>Kịch bản chiến lược</label>
            <select name="strategicScenarioId" value={form.strategicScenarioId} onChange={handleChange} style={inputStyle}>
              <option value="">--Kịch bản chiến lược--</option>
              {strategicScenarios.map(ss => <option key={ss._id} value={ss._id}>{ss.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Tài sản</label>
            <select name="asset" value={form.asset} onChange={handleChange} style={inputStyle}>
              <option value="">--Tài sản--</option>
              {assets.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Mối đe dọa</label>
            <select name="threat" value={form.threat} onChange={handleChange} style={inputStyle}>
              <option value="">--Mối đe dọa--</option>
              {threats.map(t => <option key={t._id} value={t._id}>{t.description}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Lỗ hổng</label>
            <select name="vulnerability" value={form.vulnerability} onChange={handleChange} style={inputStyle}>
              <option value="">--Lỗ hổng--</option>
              {vulnerabilities.map(v => <option key={v._id} value={v._id}>{v.description}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>
              Hiệu quả kiểm soát<br />
              <span style={{ fontWeight: 400, fontSize: 12, color: '#666' }}>
                (1: Kém nhất, 5: Tốt nhất)
              </span>
            </label>
            <input name="controlEffectiveness" type="number" min={1} max={5} value={form.controlEffectiveness} onChange={handleChange} style={inputStyle} placeholder="1-5" />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>
              Khả năng phát hiện<br />
              <span style={{ fontWeight: 400, fontSize: 12, color: '#666' }}>
                (1: Khó nhất, 5: Dễ nhất)
              </span>
            </label>
            <input name="detectability" type="number" min={1} max={5} value={form.detectability} onChange={handleChange} style={inputStyle} placeholder="1-5" />
          </div>
          <div>
            <label style={{ fontWeight: 500 }}>Tần suất phơi nhiễm<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#666' }}>(1: Hiếm, 5: Thường xuyên)</span></label>
            <input name="exposureFrequency" type="number" min={1} max={5} value={form.exposureFrequency} onChange={handleChange} style={inputStyle} placeholder="1-5" />
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 22 }}>
            <button type="submit" style={{ background: '#33FFCC', color: '#fff', padding: '6px 16px', borderRadius: 8, flex: 1 }}>{editingId ? 'Cập nhật' : 'Thêm'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: '', description: '', strategicScenarioId: '', asset: '', threat: '', vulnerability: '', controlEffectiveness: 1, detectability: 1, exposureFrequency: 1 }); }} style={{ background: '#AAAAAA', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Hủy</button>}
            <button type="button" onClick={fetchData} style={{ background: '#19c6e6', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Làm mới danh sách</button>
          </div>
        </form>
        <div style={{
          margin: '0 32px 32px 32px',
          background: '#fff',
          borderRadius: 8,
          boxShadow: '0 2px 8px #0001',
          padding: 0,
          overflowX: 'auto'
        }}>
          <table className="table-main" style={{ minWidth: 1100, width: '100%' }}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Mô tả</th>
                <th>Kịch bản chiến lược</th>
                <th>Tài sản</th>
                <th>Mối đe dọa</th>
                <th>Lỗ hổng</th>
                <th>Hiệu quả kiểm soát</th>
                <th>Phát hiện</th>
                <th>Tần suất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {operationScenarios.map(sc => (
                <tr key={sc._id}>
                  <td>{sc.name}</td>
                  <td>{sc.description}</td>
                  <td>{strategicScenarios.find(ss => ss._id === (sc.strategicScenarioId?._id || sc.strategicScenarioId))?.name || ''}</td>
                  <td>{assets.find(a => a._id === (sc.asset?._id || sc.asset))?.name || ''}</td>
                  <td>{threats.find(t => t._id === (sc.threat?._id || sc.threat))?.description || ''}</td>
                  <td>{vulnerabilities.find(v => v._id === (sc.vulnerability?._id || sc.vulnerability))?.description || ''}</td>
                  <td>{sc.controlEffectiveness}</td>
                  <td>{sc.detectability}</td>
                  <td>{sc.exposureFrequency}</td>
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
