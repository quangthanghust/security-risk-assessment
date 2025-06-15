import React, { useEffect, useState } from 'react';
import { getWeightConfigs, updateWeightConfig } from '../services/weightConfigService';
import { getStrategicScenarios } from '../services/strategicScenarioService';
import { getOperationScenarios } from '../services/operationScenarioService';
import { getAssets } from '../services/assetService';
import { getThreats } from '../services/threatService';
import { getVulnerabilities } from '../services/vulnerabilityService';
import { RISK_MATRIX, LIKELIHOOD_LABELS, CONSEQUENCE_LABELS } from '../constants/riskMatrix';
import api from '../services/api';
import moment from 'moment-timezone';
import { getLatestRiskItems } from '../services/riskItemService';
import { useLocation } from 'react-router-dom';


export default function RiskEvaluationResultPage() {
  const [weightConfig, setWeightConfig] = useState(null);
  const [editWeights, setEditWeights] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [strategicScenarios, setStrategicScenarios] = useState([]);
  const [operationScenarios, setOperationScenarios] = useState([]);
  const [assets, setAssets] = useState([]);
  const [threats, setThreats] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [riskItems, setRiskItems] = useState([]);
  const [loadingRisk, setLoadingRisk] = useState(false);
  const [riskMsg, setRiskMsg] = useState('');
  const location = useLocation();
  const [riskAcceptanceCriteria, setRiskAcceptanceCriteria] = useState(null);

  useEffect(() => {
    getWeightConfigs().then(res => {
      if (res.data && res.data.length > 0) {
        setWeightConfig(res.data[0]);
        setEditWeights({
          ...res.data[0].consequenceWeights,
          ...res.data[0].likelihoodWeights
        });
      } else {
        setWeightConfig(null);
        setEditWeights(null);
      }
    });
  }, []);

  useEffect(() => {
    api.get('/risk-acceptance-criteria').then(res => {
      if (res.data && res.data.length > 0) setRiskAcceptanceCriteria(res.data[0]);
    });
  }, []);

  useEffect(() => {
    getStrategicScenarios().then(res => setStrategicScenarios(res.data));
    getOperationScenarios().then(res => setOperationScenarios(res.data));
    getAssets().then(res => setAssets(res.data));
    getThreats().then(res => setThreats(res.data));
    getVulnerabilities().then(res => setVulnerabilities(res.data));
  }, [location]);

  const handleWeightChange = (key, value) => {
    setEditWeights(w => ({ ...w, [key]: Number(value) }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMsg('');
    try {
      await updateWeightConfig(weightConfig._id, {
        consequenceWeights: {
          assetValue: editWeights.assetValue,
          impactTypeLevel: editWeights.impactTypeLevel,
          interestedPartiesLevel: editWeights.interestedPartiesLevel,
          dependency: editWeights.dependency,
          lossMagnitude: editWeights.lossMagnitude
        },
        likelihoodWeights: {
          vulnerabilityLevel: editWeights.vulnerabilityLevel,
          threatLevel: editWeights.threatLevel,
          controlEffectiveness: editWeights.controlEffectiveness,
          exposureFrequency: editWeights.exposureFrequency,
          detectability: editWeights.detectability
        }
      });
      setMsg('Lưu trọng số thành công!');
    } catch {
      setMsg('Lưu trọng số thất bại!');
    }
    setSaving(false);
  };

  // Gọi API backend để sinh Risk Item khi bấm nút "Đánh giá rủi ro"
  const handleEvaluateRisk = async () => {
    setLoadingRisk(true);
    setRiskMsg('');
    try {
      await api.post('/risk-items/generate', {
        reportId: null, // hoặc truyền giá trị thực tế nếu có
        riskAcceptanceCriteriaId: riskAcceptanceCriteria?._id
      });
      await getLatestRiskItems().then(res => setRiskItems(res.data)); // luôn fetch lại riskItems mới nhất
      setRiskMsg('Đánh giá rủi ro thành công!');
    } catch {
      setRiskMsg('Đánh giá rủi ro thất bại!');
    }
    setLoadingRisk(false);
  };

  // Nếu chưa có dữ liệu trọng số thì chỉ hiển thị đang tải
  if (!weightConfig || !editWeights) {
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
          KẾT QUẢ ĐÁNH GIÁ RỦI RO
        </h2>
        <div style={{ margin: '0 32px 16px 32px' }}>
          Đang tải dữ liệu trọng số...
        </div>
      </div>
    );
  }

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
        Kết quả đánh giá rủi ro
      </h2>
      <div style={{ margin: '0 32px 16px 32px' }}>
        <h3>Công thức tính</h3>
        <div>
          <b>Hậu quả = </b>
          <input type="number" value={editWeights?.assetValue || 0} step="0.01"
            onChange={e => handleWeightChange('assetValue', e.target.value)} style={{ width: 50 }} /> × Giá trị tài sản +
          <input type="number" value={editWeights?.impactTypeLevel || 0} step="0.01"
            onChange={e => handleWeightChange('impactTypeLevel', e.target.value)} style={{ width: 50 }} /> × Mức độ tác động +
          <input type="number" value={editWeights?.interestedPartiesLevel || 0} step="0.01"
            onChange={e => handleWeightChange('interestedPartiesLevel', e.target.value)} style={{ width: 50 }} /> × Mức độ bên liên quan +
          <input type="number" value={editWeights?.dependency || 0} step="0.01"
            onChange={e => handleWeightChange('dependency', e.target.value)} style={{ width: 50 }} /> × Mức độ phụ thuộc +
          <input type="number" value={editWeights?.lossMagnitude || 0} step="0.01"
            onChange={e => handleWeightChange('lossMagnitude', e.target.value)} style={{ width: 50 }} /> × Mức độ tổn thất
        </div>
        <div style={{ marginTop: 8 }}>
          <b>Khả năng xảy ra = </b>
          <input type="number" value={editWeights?.vulnerabilityLevel || 0} step="0.01"
            onChange={e => handleWeightChange('vulnerabilityLevel', e.target.value)} style={{ width: 50 }} /> × Mức độ lỗ hổng +
          <input type="number" value={editWeights?.threatLevel || 0} step="0.01"
            onChange={e => handleWeightChange('threatLevel', e.target.value)} style={{ width: 50 }} /> × Mức độ mối đe dọa +
          <input type="number" value={editWeights?.controlEffectiveness || 0} step="0.01"
            onChange={e => handleWeightChange('controlEffectiveness', e.target.value)} style={{ width: 50 }} /> × Hiệu quả kiểm soát +
          <input type="number" value={editWeights?.exposureFrequency || 0} step="0.01"
            onChange={e => handleWeightChange('exposureFrequency', e.target.value)} style={{ width: 50 }} /> × Tần suất phơi nhiễm +
          <input type="number" value={editWeights?.detectability || 0} step="0.01"
            onChange={e => handleWeightChange('detectability', e.target.value)} style={{ width: 50 }} /> × Khả năng phát hiện
        </div>
        <button onClick={handleSave} disabled={saving} style={{ marginTop: 12, background: '#19c6e6', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px' }}>Lưu trọng số</button>
        {msg && <div style={{ color: msg.includes('thành công') ? 'green' : 'red', marginTop: 8 }}>{msg}</div>}
      </div>

      <div style={{ margin: '0 32px 16px 32px' }}>
        <h3>Ma trận rủi ro (Risk Matrix)</h3>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '24px 0' }}>
          <table border="1" style={{ textAlign: 'center', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr>
                <th>Khả năng xảy ra \ Hậu quả</th>
                {CONSEQUENCE_LABELS.map(label => <th key={label}>{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {RISK_MATRIX.map((row, i) => (
                <tr key={i}>
                  <td><b>{LIKELIHOOD_LABELS[i]}</b></td>
                  {row.map((cell, j) => (
                    <td key={j} style={{ background: riskLevelColor(cell), minWidth: 80 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ margin: '0 32px 16px 32px' }}>
        <h3>Thông tin liên quan</h3>
        <div style={{ overflowX: 'auto', marginBottom: 24 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: 8 }}>Hệ thống</th>
                <th style={{ padding: 8 }}>Tài sản</th>
                <th style={{ padding: 8 }}>Giá trị tài sản</th>
                <th style={{ padding: 8 }}>Mức độ tác động</th>
                <th style={{ padding: 8 }}>Mức độ phụ thuộc</th>
                <th style={{ padding: 8 }}>Mức độ tổn thất</th>
                <th style={{ padding: 8 }}>Kịch bản chiến lược</th>
                <th style={{ padding: 8 }}>Mức độ nghiêm trọng (bên liên quan)</th>
                <th style={{ padding: 8 }}>Kịch bản vận hành</th>
                <th style={{ padding: 8 }}>Mối đe dọa</th>
                <th style={{ padding: 8 }}>Mức độ mối đe dọa</th>
                <th style={{ padding: 8 }}>Lỗ hổng</th>
                <th style={{ padding: 8 }}>Mức độ lỗ hổng</th>
                <th style={{ padding: 8 }}>Hiệu quả kiểm soát</th>
                <th style={{ padding: 8 }}>Khả năng phát hiện</th>
                <th style={{ padding: 8 }}>Tần suất phơi nhiễm</th>
              </tr>
            </thead>
            <tbody>
              {operationScenarios.flatMap(os => {
                // Lấy asset, strategicScenario, threat, vulnerability liên quan
                const asset = assets.find(a => a._id === (os.asset?._id || os.asset));
                const ss = strategicScenarios.find(s => (s._id === (os.strategicScenarioId?._id || os.strategicScenarioId)));
                const threat = os.threat ? threats.find(t => t._id === (os.threat._id || os.threat)) : null;
                const vulnerability = os.vulnerability ? vulnerabilities.find(v => v._id === (os.vulnerability._id || os.vulnerability)) : null;

                // Chỉ render khi đủ tất cả các thông tin và liên kết đúng
                if (!asset || !ss || !threat || !vulnerability) return [];

                const system = asset.system?.name || '';

                return (
                  <tr key={os._id}>
                    <td style={{ padding: 8 }}>{system}</td>
                    <td style={{ padding: 8 }}>{asset.name}</td>
                    <td style={{ padding: 8 }}>{asset.value}</td>
                    <td style={{ padding: 8 }}>{asset.impactTypeLevel}</td>
                    <td style={{ padding: 8 }}>{asset.dependency}</td>
                    <td style={{ padding: 8 }}>{asset.lossMagnitude}</td>
                    <td style={{ padding: 8 }}>{ss.name}</td>
                    <td style={{ padding: 8 }}>{ss.interestedPartiesLevel}</td>
                    <td style={{ padding: 8 }}>{os.name}</td>
                    <td style={{ padding: 8 }}>{threat.description}</td>
                    <td style={{ padding: 8 }}>{threat.threatLevel}</td>
                    <td style={{ padding: 8 }}>{vulnerability.description}</td>
                    <td style={{ padding: 8 }}>{vulnerability.vulnerabilityLevel}</td>
                    <td style={{ padding: 8 }}>{os.controlEffectiveness}</td>
                    <td style={{ padding: 8 }}>{os.detectability}</td>
                    <td style={{ padding: 8 }}>{os.exposureFrequency}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ margin: '0 32px 16px 32px' }}>
        <button onClick={handleEvaluateRisk} disabled={loadingRisk}
          style={{ marginBottom: 18, background: '#19c6e6', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 16px' }}>
          {loadingRisk ? 'Đang đánh giá...' : 'Đánh giá rủi ro'}
        </button>
        {riskMsg && <div style={{ color: riskMsg.includes('thành công') ? 'green' : 'red', marginBottom: 12 }}>{riskMsg}</div>}
      </div>

      <div style={{ margin: '0 32px 16px 32px' }}>
        <h3>Kết quả đánh giá rủi ro</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
            <thead>
              <tr style={{ background: '#eee' }}>
                <th style={{ padding: 10 }}>Mô tả rủi ro</th>
                <th style={{ padding: 10 }}>Hệ thống</th>
                <th style={{ padding: 10 }}>Hậu quả</th>
                <th style={{ padding: 10 }}>Khả năng xảy ra</th>
                <th style={{ padding: 10 }}>Mức độ rủi ro</th>
                <th style={{ padding: 10 }}>Kết luận</th>
                <th style={{ padding: 10 }}>Khuyến nghị</th>
                <th style={{ padding: 10 }}>Người chịu trách nhiệm</th>
                <th style={{ padding: 10 }}>Thời gian đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {riskItems.map(item => {
                const asset = assets.find(a => a._id === (item.asset?._id || item.asset));
                const system = asset && asset.system ? asset.system.name : '';
                const manager = asset && asset.system && asset.system.manager ? asset.system.manager : '';
                return (
                  <tr key={item._id}>
                    <td style={{ padding: 8 }}>
                      {item.riskDescription}
                      <br />
                      <span style={{ color: '#888', fontSize: 13 }}>
                        (Hệ thống: {system})
                      </span>
                    </td>
                    <td style={{ padding: 8 }}>{system}</td>
                    <td style={{ padding: 8 }}>{item.consequence}</td>
                    <td style={{ padding: 8 }}>{item.likelihood}</td>
                    <td style={{ padding: 8 }}>{item.riskLevel}</td>
                    <td style={{ padding: 8 }}>{item.evaluationResult}</td>
                    <td style={{ padding: 8 }}>{item.treatmentRecommendation}</td>
                    <td style={{ padding: 8 }}>{manager}</td>
                    <td style={{ padding: 8 }}>
                      {item.createdAt
                        ? moment(item.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
                        : ''}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Hàm màu sắc cho từng mức độ rủi ro (tiếng Việt)
function riskLevelColor(level) {
  switch (level) {
    case 'Rất cao': return '#ff4d4f';
    case 'Cao': return '#faad14';
    case 'Trung bình': return '#fadb14';
    case 'Thấp': return '#52c41a';
    case 'Rất thấp': return '#b7eb8f';
    default: return '';
  }
}