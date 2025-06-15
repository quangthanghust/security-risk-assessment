import React, { useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import ssraLogo from '../assets/ssra-logo.png';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'Vui lòng kiểm tra email để đặt lại mật khẩu!');
    } catch (error) {
      setErr(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const inputStyle = {
    borderRadius: 8,
    border: '1px solid #e0e0e0',
    background: '#f7fafd',
    padding: '12px 16px',
    fontSize: 16,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: 8,
    transition: 'border 0.2s'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #19c6e6 0%, #a084e8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 18,
          boxShadow: '0 4px 24px #0002',
          width: 900,
          maxWidth: '98vw',
          minHeight: 440,
          display: 'flex',
          overflow: 'hidden',
          border: '1.5px solid #19c6e6'
        }}
      >
        {/* Bên trái: Logo + Slogan */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1.5px solid #e0e0e0',
            padding: 32
          }}
        >
          <img
            src={ssraLogo}
            alt="SSRA Logo"
            style={{ width: 120, marginBottom: 18 }}
          />
          <h2 style={{
            fontFamily: 'inherit',
            color: '#19c6e6',
            fontWeight: 700,
            fontSize: 32,
            margin: 0,
            letterSpacing: 1,
            textAlign: 'center'
          }}>
            SSRA
          </h2>
          <div style={{
            color: '#444',
            fontSize: 18,
            marginTop: 8,
            textAlign: 'center',
            fontWeight: 500,
            maxWidth: 320,
            lineHeight: 1.5
          }}>
            Quản lý rủi ro bảo mật dễ dàng<br />
            Tiết kiệm thời gian, tối ưu hiệu quả!
          </div>
        </div>
        {/* Bên phải: Form quên mật khẩu */}
        <div
          style={{
            flex: 1.2,
            background: '#fff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '36px 48px'
          }}
        >
          <div style={{ maxWidth: 360, margin: '0 auto', width: '100%' }}>
            <div style={{ fontWeight: 700, fontSize: 28, marginBottom: 12, color: '#19c6e6', letterSpacing: 0.5 }}>
              Quên mật khẩu
            </div>
            <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Email</label>
              <input
                type="email"
                placeholder="Nhập email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              {err && <div style={{ color: 'red', marginBottom: 8 }}>{err}</div>}
              {message && <div style={{ color: 'green', marginBottom: 8 }}>{message}</div>}
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: '#19c6e6',
                  color: '#fff',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 18,
                  cursor: 'pointer',
                  marginBottom: 8,
                  boxShadow: '0 2px 8px #19c6e633',
                  letterSpacing: 1
                }}
              >
                Gửi yêu cầu
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{ color: '#888', fontSize: 15 }}>Bạn đã nhớ mật khẩu? </span>
              <Link to="/login" style={{ color: '#19c6e6', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}