import React, { useEffect, useState } from 'react';
import { getAssets, createAsset, updateAsset, deleteAsset, exportAssetsExcel, importAssetsExcel } from '../services/assetService';
import { getSystemProfiles } from '../services/systemProfileService';
import moment from 'moment-timezone';

const IMPACT_TYPE_OPTIONS = [
  { value: 'Confidentiality', label: 'Bảo mật' },
  { value: 'Integrity', label: 'Toàn vẹn' },
  { value: 'Availability', label: 'Sẵn sàng' },
  { value: 'Legal', label: 'Pháp lý' },
  { value: 'Reputation', label: 'Uy tín' },
  { value: 'Other', label: 'Khác' }
];

const ASSET_TYPE_OPTIONS = [
  { value: 'Information', label: 'Thông tin' },
  { value: 'Hardware', label: 'Phần cứng' },
  { value: 'Software', label: 'Phần mềm' },
  { value: 'Personnel', label: 'Nhân sự' },
  { value: 'Site', label: 'Địa điểm' },
  { value: 'Service', label: 'Dịch vụ' },
  { value: 'Other', label: 'Khác' }
];

export default function AssetPage() {
  const [assets, setAssets] = useState([]);
  const [systems, setSystems] = useState([]);
  const [systemFilter, setSystemFilter] = useState('all');
  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    assetType: 'Information',
    value: 1,
    impactTypes: [],
    impactTypeLevel: 1,
    dependency: 1,
    lossMagnitude: 1
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [success, setSuccess] = useState('');

  const filteredAssets = systemFilter === 'all'
    ? assets
    : assets.filter(asset => asset.system && asset.system._id === systemFilter);

  const fetchAssets = async () => {
    setLoading(true);
    setErr('');
    try {
      const res = await getAssets();
      setAssets(res.data);
    } catch {
      setErr('Không thể tải danh sách tài sản');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAssets();
    getSystemProfiles().then(res => setSystems(res.data));
  }, []);

  const handleChange = e => {
    const { name, value, type, options } = e.target;
    if (name === 'impactTypes') {
      setForm(f => ({
        ...f,
        impactTypes: Array.from(options).filter(o => o.selected).map(o => o.value)
      }));
    } else if (type === 'number') {
      setForm(f => ({ ...f, [name]: value === '' ? '' : Number(value) })); // ép kiểu số, giữ '' nếu rỗng
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      if (editingId) {
        await updateAsset(editingId, form);
        setSuccess('Cập nhật tài sản thành công!');
      } else {
        await createAsset(form);
        setSuccess('Thêm tài sản thành công!');
      }
      setForm({
        name: '',
        code: '',
        description: '',
        assetType: 'Information',
        value: 1,
        impactTypes: [],
        impactTypeLevel: 1,
        dependency: 1,
        lossMagnitude: 1
      });
      setEditingId(null);
      await fetchAssets();
    } catch {
      setErr('Lưu tài sản thất bại');
    }
    setLoading(false);
  };

  const handleEdit = asset => {
    setForm({
      name: asset.name,
      code: asset.code,
      description: asset.description,
      assetType: asset.assetType,
      value: asset.value,
      impactTypes: asset.impactTypes || [],
      impactTypeLevel: asset.impactTypeLevel,
      dependency: asset.dependency,
      lossMagnitude: asset.lossMagnitude
    });
    setEditingId(asset._id);
  };

  const handleDelete = async id => {
    if (!window.confirm('Bạn chắc chắn muốn xóa tài sản này?')) return;
    setLoading(true);
    setErr('');
    setSuccess('');
    try {
      await deleteAsset(id);
      setSuccess('Xóa tài sản thành công!');
      await fetchAssets();
    } catch {
      setErr('Xóa thất bại');
    }
    setLoading(false);
  };

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
          padding: '40px 0 0 0', // padding đều, không maxWidth, không borderRadius, không boxShadow
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
          Quản lý tài sản
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
          <div style={{ flex: '1 1 220px', minWidth: 220 }}>
            <label style={{ fontWeight: 500 }}>Tên tài sản</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Tên tài sản" required style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 180px', minWidth: 180 }}>
            <label style={{ fontWeight: 500 }}>Mã tài sản</label>
            <input name="code" value={form.code} onChange={handleChange} placeholder="Mã tài sản" required style={inputStyle} />
          </div>
          <div style={{ flex: '2 1 180px', minWidth: 180 }}>
            <label style={{ fontWeight: 500 }}>Mô tả</label>
            <input name="description" value={form.description} onChange={handleChange} placeholder="Mô tả" required style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 180px', minWidth: 180 }}>
            <label style={{ fontWeight: 500 }}>Loại tài sản</label>
            <select name="assetType" value={form.assetType} onChange={handleChange} style={inputStyle}>
              {ASSET_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 140px', minWidth: 140 }}>
            <label style={{ fontWeight: 500 }}>Giá trị tài sản<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#888' }}>(1-5)</span></label>
            <input name="value" type="number" min={1} max={5} value={form.value} onChange={handleChange} placeholder="1-5" style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 180px', minWidth: 180 }}>
            <label style={{ fontWeight: 500 }}>Loại tác động</label>
            <select
              name="impactTypes"
              multiple
              value={form.impactTypes}
              onChange={handleChange}
              style={inputStyle}
            >
              {IMPACT_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Giữ Ctrl (Cmd) để chọn nhiều</div>
          </div>
          <div style={{ flex: '1 1 140px', minWidth: 140 }}>
            <label style={{ fontWeight: 500 }}>Mức độ tác động<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#888' }}>(1-5)</span></label>
            <input name="impactTypeLevel" type="number" min={1} max={5} value={form.impactTypeLevel} onChange={handleChange} placeholder="1-5" style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 140px', minWidth: 140 }}>
            <label style={{ fontWeight: 500 }}>Mức độ phụ thuộc<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#888' }}>(1-5)</span></label>
            <input name="dependency" type="number" min={1} max={5} value={form.dependency} onChange={handleChange} placeholder="1-5" style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 140px', minWidth: 140 }}>
            <label style={{ fontWeight: 500 }}>Mức độ tổn thất<br /><span style={{ fontWeight: 400, fontSize: 12, color: '#888' }}>(1-5)</span></label>
            <input name="lossMagnitude" type="number" min={1} max={5} value={form.lossMagnitude} onChange={handleChange} placeholder="1-5" style={inputStyle} />
          </div>
          <div style={{ flex: '1 1 180px', minWidth: 180 }}>
            <label style={{ fontWeight: 500 }}>Hệ thống</label>
            <select name="system" value={form.system || ''} onChange={handleChange} required style={inputStyle}>
              <option value="">--Chọn hệ thống--</option>
              {systems.map(sys => (
                <option key={sys._id} value={sys._id}>{sys.name}</option>
              ))}
            </select>
          </div>
          <div style={{ flex: '1 1 120px', minWidth: 120, display: 'flex', gap: 8, alignItems: 'flex-end', marginTop: 22 }}>
            <button type="submit" style={{ background: '#33FFCC', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>{editingId ? 'Cập nhật' : 'Thêm'}</button>
            {editingId && <button type="button" onClick={() => {
              setEditingId(null);
              setForm({
                name: '',
                code: '',
                description: '',
                assetType: 'Information',
                value: 1,
                impactTypes: [],
                impactTypeLevel: 1,
                dependency: 1,
                lossMagnitude: 1
              });
            }} style={{ background: '#AAAAAA', color: '#fff', padding: '6px 16px', borderRadius: 8 }}>Hủy</button>}
          </div>
        </form>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          margin: '0 32px 18px 32px'
        }}>
          <label style={{ marginRight: 8, fontWeight: 500 }}>Lọc theo hệ thống:</label>
          <select
            value={systemFilter}
            onChange={e => setSystemFilter(e.target.value)}
            style={{
              minWidth: 180,
              padding: 8,
              borderRadius: 8,
              background: '#f7fafd',
              border: '1px solid #e0e0e0'
            }}
          >
            <option value="all">Tất cả hệ thống</option>
            {systems.map(sys => (
              <option key={sys._id} value={sys._id}>{sys.name}</option>
            ))}
          </select>
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
                const res = await exportAssetsExcel();
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const a = document.createElement('a');
                a.href = url;
                a.download = 'tai_san.xlsx';
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
            htmlFor="import-asset-excel"
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
              id="import-asset-excel"
              type="file"
              accept=".xlsx, .xls"
              onChange={async e => {
                const file = e.target.files[0];
                if (!file) return;
                const formData = new FormData();
                formData.append('file', file);
                try {
                  await importAssetsExcel(formData);
                  alert('Import thành công!');
                  fetchAssets(); // reload lại danh sách
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
          <table className="table-main" style={{ minWidth: 1200, width: '100%' }}>
            <thead>
              <tr>
                <th>Tên</th>
                <th>Mã</th>
                <th>Mô tả</th>
                <th>Loại</th>
                <th>Giá trị</th>
                <th>Loại tác động</th>
                <th>Mức độ tác động</th>
                <th>Mức độ phụ thuộc</th>
                <th>Mức độ tổn thất</th>
                <th>Hệ thống</th>
                <th>Thời gian tạo</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map(asset => (
                <tr key={asset._id}>
                  <td>{asset.name}</td>
                  <td>{asset.code}</td>
                  <td>{asset.description}</td>
                  <td>{ASSET_TYPE_OPTIONS.find(opt => opt.value === asset.assetType)?.label || asset.assetType}</td>
                  <td>{asset.value ?? 1}</td>
                  <td>
                    {(asset.impactTypes || []).map(type =>
                      IMPACT_TYPE_OPTIONS.find(opt => opt.value === type)?.label || type
                    ).join(', ')}
                  </td>
                  <td>{asset.impactTypeLevel ?? 1}</td>
                  <td>{asset.dependency ?? 1}</td>
                  <td>{asset.lossMagnitude ?? 1}</td>
                  <td>{asset.system?.name || ''}</td>
                  <td>
                    {asset.createdAt
                      ? moment(asset.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
                      : ''}
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleEdit(asset)}
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
                      onClick={() => handleDelete(asset._id)}
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