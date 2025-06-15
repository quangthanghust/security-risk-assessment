import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
// Import logo hệ thống
import ssraLogo from '../assets/ssra-logo.png'; // Đảm bảo bạn đã lưu ảnh logo với tên này trong thư mục assets

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [fieldErr, setFieldErr] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email) errors.email = 'Email không được để trống';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) errors.email = 'Email không hợp lệ';
    if (!password) errors.password = 'Mật khẩu không được để trống';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const errors = validate();
    setFieldErr(errors);
    if (Object.keys(errors).length > 0) return;
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/gioi-thieu');
    } catch (error) {
      setErr(error.response?.data?.message || 'Đăng nhập thất bại');
    }
    setLoading(false);
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
          minHeight: 540,
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
        {/* Bên phải: Form đăng nhập */}
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
              Đăng nhập
            </div>
            <form onSubmit={handleSubmit}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Email</label>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              {fieldErr.email && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErr.email}</div>}

              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block', marginTop: 8 }}>Mật khẩu</label>
              <input
                type="password"
                placeholder="Nhập mật khẩu của bạn"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              {fieldErr.password && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErr.password}</div>}

              {err && <div style={{ color: 'red', marginBottom: 12 }}>{err}</div>}

              <div style={{ marginBottom: 16, marginTop: 2, textAlign: 'right' }}>
                <Link to="/forgot-password" style={{ color: '#19c6e6', fontSize: 15, textDecoration: 'none', fontWeight: 500 }}>
                  Quên mật khẩu?
                </Link>
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: '#19c6e6',
                  color: '#fff',
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 18,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginBottom: 8,
                  boxShadow: '0 2px 8px #19c6e633',
                  letterSpacing: 1
                }}
              >
                {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{ color: '#888', fontSize: 15 }}>Chưa có tài khoản? </span>
              <Link to="/register" style={{ color: '#19c6e6', fontWeight: 600, textDecoration: 'none', fontSize: 16 }}>
                Đăng ký tại đây
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}