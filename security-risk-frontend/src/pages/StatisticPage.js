import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#d7263d', '#6c3483', '#229954'];

// Ánh xạ loại tài sản sang tiếng Việt
const ASSET_TYPE_LABELS = {
  Information: 'Thông tin',
  Hardware: 'Phần cứng',
  Software: 'Phần mềm',
  Personnel: 'Nhân sự',
  Site: 'Địa điểm',
  Service: 'Dịch vụ',
  Other: 'Khác'
};

export default function StatisticPage() {
  const [overview, setOverview] = useState(null);
  const [riskLevels, setRiskLevels] = useState([]);
  const [assetTypes, setAssetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // Chuyển đổi loại tài sản sang tiếng Việt
  const assetTypesVN = assetTypes.map(item => ({
    ...item,
    type: ASSET_TYPE_LABELS[item.type] || item.type
  }));

  useEffect(() => {
    setLoading(true);
    setErr('');
    Promise.all([
      api.get('/statistics/overview'),
      api.get('/statistics/risk-levels'),
      api.get('/statistics/asset-types')
    ])
      .then(([ov, rl, at]) => {
        setOverview(ov.data);
        setRiskLevels(rl.data);
        setAssetTypes(at.data);
      })
      .catch(() => setErr('Không thể tải dữ liệu thống kê'))
      .finally(() => setLoading(false));
  }, []);

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
      <h2 style={{
        color: '#19c6e6',
        fontWeight: 700,
        fontSize: 32,
        marginBottom: 32,
        letterSpacing: 0.5,
        marginLeft: 32
      }}>
        Thống kê hệ thống
      </h2>
      <div style={{ margin: '0 32px 16px 32px' }}>
        {loading && <div>Đang tải dữ liệu...</div>}
        {err && <div style={{ color: 'red' }}>{err}</div>}
        {!loading && overview && (
          <>
            <h3 style={{ marginTop: 24 }}>Tổng quan</h3>
            <ul style={{ fontSize: 17, marginBottom: 24 }}>
              <li>Tổng số tài sản: <b>{overview.assets}</b></li>
              <li>Tổng số lỗ hổng: <b>{overview.vulnerabilities}</b></li>
              <li>Tổng số mối đe dọa: <b>{overview.threats}</b></li>
              <li>Tổng số kịch bản chiến lược: <b>{overview.strategicScenarios}</b></li>
              <li>Tổng số kịch bản vận hành: <b>{overview.operationScenarios}</b></li>
              <li>Tổng số mức độ rủi ro: <b>{overview.riskItems}</b></li>
            </ul>
          </>
        )}
      </div>
      <div style={{ margin: '0 32px 16px 32px' }}>
        {!loading && (
          <>
            <h3 style={{ marginTop: 24 }}>Thống kê mức độ rủi ro</h3>
            <div style={{ background: '#fff', borderRadius: 8, padding: 16, marginBottom: 24 }}>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={riskLevels}>
                  <XAxis dataKey="level" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count">
                    {riskLevels.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={
                          entry.level === 'Rất cao' ? '#ff4d4f' :
                            entry.level === 'Cao' ? '#faad14' :
                              entry.level === 'Trung bình' ? '#fadb14' :
                                entry.level === 'Thấp' ? '#52c41a' :
                                  '#b7eb8f'
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <h3 style={{ marginTop: 24 }}>Thống kê loại tài sản</h3>
            <div style={{ background: '#fff', borderRadius: 8, padding: 16 }}>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={assetTypesVN}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {assetTypesVN.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
