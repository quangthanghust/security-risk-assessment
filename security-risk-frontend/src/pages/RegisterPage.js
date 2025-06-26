import React, { useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';
import ssraLogo from '../assets/ssra-logo.png';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [err, setErr] = useState('');
  const [fieldErr, setFieldErr] = useState({});
  const navigate = useNavigate();

  const validatePassword = (password) => {
    if (password.length < 8) return 'Mật khẩu phải dài ít nhất 8 ký tự.';
    if (!/[a-z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái thường.';
    if (!/[A-Z]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ cái in hoa.';
    if (!/[0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 chữ số.';
    if (!/[^A-Za-z0-9]/.test(password)) return 'Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt.';
    return '';
  };

  const validate = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Họ tên không được để trống';
    if (!email) errors.email = 'Email không được để trống';
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(email)) errors.email = 'Email không hợp lệ';
    if (!password) errors.password = 'Mật khẩu không được để trống';
    else {
      const pwErr = validatePassword(password);
      if (pwErr) errors.password = pwErr;
    }
    if (!confirm) errors.confirm = 'Vui lòng nhập lại mật khẩu';
    else if (password !== confirm) errors.confirm = 'Mật khẩu nhập lại không khớp';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setMessage('');
    const errors = validate();
    setFieldErr(errors);
    if (Object.keys(errors).length > 0) return;
    try {
      const res = await api.post('/auth/register', { username, email, password });
      setMessage(res.data.message || 'Đăng ký thành công, kiểm tra email để xác thực!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setErr(error.response?.data?.message || 'Đăng ký thất bại');
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
        {/* Bên phải: Form đăng ký */}
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
              Đăng ký
            </div>
            <form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block' }}>Họ tên</label>
              <input
                type="text"
                placeholder="Họ tên"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={inputStyle}
              />
              {fieldErr.username && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErr.username}</div>}

              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block', marginTop: 8 }}>Email</label>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
              />
              {fieldErr.email && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErr.email}</div>}

              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block', marginTop: 8 }}>Mật khẩu</label>
              <input
                type="password"
                placeholder="Mật khẩu"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
              />
              {fieldErr.password && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErr.password}</div>}

              <label style={{ fontWeight: 500, marginBottom: 4, display: 'block', marginTop: 8 }}>Xác nhận mật khẩu</label>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                required
                style={inputStyle}
              />
              {fieldErr.confirm && <div style={{ color: 'red', marginBottom: 8 }}>{fieldErr.confirm}</div>}

              {err && <div style={{ color: 'red', marginBottom: 12 }}>{err}</div>}
              {message && <div style={{ color: 'green', marginBottom: 12 }}>{message}</div>}

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
                ĐĂNG KÝ
              </button>
            </form>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <span style={{ color: '#888', fontSize: 15 }}>Đã có tài khoản? </span>
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