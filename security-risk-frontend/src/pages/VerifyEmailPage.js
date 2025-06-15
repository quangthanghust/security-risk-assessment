import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmailPage() {
  const query = useQuery();
  const email = query.get('email');
  const token = query.get('token');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.post('/auth/verify-email', { email, token });
        setMessage(res.data.message || 'Xác thực email thành công!');
        // Nếu có token thì tự động đăng nhập và chuyển đến dashboard
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } catch (error) {
        setErr(error.response?.data?.message || 'Xác thực thất bại');
      }
    };
    if (email && token) verify();
  }, [email, token, navigate]);

  return (
    <div style={{
      minHeight: '100vh', background: '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        background: '#fff', padding: 40, borderRadius: 8, boxShadow: '0 2px 8px #0001',
        minWidth: 400, border: '2px solid #a084e8'
      }}>
        <h2 style={{ fontWeight: 700, fontSize: 32, margin: 0 }}>Xác thực Email</h2>
        {err && <div style={{ color: 'red', margin: '24px 0' }}>{err}</div>}
        {message && <div style={{ color: 'green', margin: '24px 0' }}>{message}</div>}
      </div>
    </div>
  );
}