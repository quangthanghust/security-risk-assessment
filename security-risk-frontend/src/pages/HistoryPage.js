import React, { useEffect, useState } from 'react';
import { getAssessmentSessions, getRiskItemsBySession } from '../services/riskItemService';
import moment from 'moment-timezone';
import { getAssets } from '../services/assetService';
import { getRiskLevelTrend } from '../services/statisticsService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function HistoryPage() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState('');
    const [riskItems, setRiskItems] = useState([]);
    const [assets, setAssets] = useState([]);
    const [riskLevelTrend, setRiskLevelTrend] = useState([]);

    useEffect(() => {
        getAssets().then(res => setAssets(res.data));
        getAssessmentSessions().then(res => {
            setSessions(res.data);
            if (res.data.length) setSelectedSession(res.data[0]._id);
        });
        getRiskLevelTrend().then(res => setRiskLevelTrend(res.data));
    }, []);

    useEffect(() => {
        if (selectedSession) {
            getRiskItemsBySession(selectedSession).then(res => setRiskItems(res.data));
        }
    }, [selectedSession]);

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
                Lịch sử đánh giá rủi ro
            </h2>
            <div style={{ margin: '0 32px 16px 32px' }}>
                <label style={{ fontWeight: 500, marginRight: 8 }}>Chọn phiên đánh giá: </label>
                <select
                    value={selectedSession}
                    onChange={e => setSelectedSession(e.target.value)}
                    style={{
                        minWidth: 180,
                        padding: 8,
                        borderRadius: 8,
                        background: '#f7fafd',
                        border: '1px solid #e0e0e0'
                    }}
                >
                    {sessions.map(s => (
                        <option key={s._id} value={s._id}>
                            {moment(s.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')}
                        </option>
                    ))}
                </select>
            </div>
            <div style={{ overflowX: 'auto', margin: '0 32px 0 32px' }}>
                <table className="table-main" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 16, background: '#fff' }}>
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
                                    <td style={{ padding: 8 }}>{item.riskDescription}</td>
                                    <td style={{ padding: 8 }}>{system}</td>
                                    <td style={{ padding: 8 }}>{item.consequence}</td>
                                    <td style={{ padding: 8 }}>{item.likelihood}</td>
                                    <td style={{ padding: 8 }}>{item.riskLevel}</td>
                                    <td style={{ padding: 8 }}>{item.evaluationResult}</td>
                                    <td style={{ padding: 8 }}>{item.treatmentRecommendation}</td>
                                    <td style={{ padding: 8 }}>{item.responsiblePerson || manager}</td>
                                    <td style={{ padding: 8 }}>
                                        {item.createdAt
                                            ? moment(item.createdAt).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')
                                            : ''}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <h3 style={{ margin: '32px 32px 16px 32px' }}>Biến động mức độ rủi ro theo từng phiên đánh giá</h3>
            <div style={{
                background: '#f7fafd',
                borderRadius: 8,
                padding: 16,
                marginBottom: 8
            }}>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={riskLevelTrend}>
                        <XAxis
                            dataKey="createdAt"
                            tickFormatter={v => moment(v).tz('Asia/Ho_Chi_Minh').format('DD/MM HH:mm')}
                        />
                        <YAxis allowDecimals={false} />
                        <Tooltip labelFormatter={v => moment(v).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY HH:mm:ss')} />
                        <Legend />
                        <Bar dataKey="Rất thấp" stackId="a" fill="#b7eb8f" barSize={18} />
                        <Bar dataKey="Thấp" stackId="a" fill="#52c41a" barSize={18} />
                        <Bar dataKey="Trung bình" stackId="a" fill="#fadb14" barSize={18} />
                        <Bar dataKey="Cao" stackId="a" fill="#faad14" barSize={18} />
                        <Bar dataKey="Rất cao" stackId="a" fill="#ff4d4f" barSize={18} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
