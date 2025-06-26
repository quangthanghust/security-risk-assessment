import React, { useState, useEffect } from 'react';
import { FaInfoCircle, FaUser, FaClipboardList, FaChartBar, FaSignOutAlt, FaBug, FaShieldAlt, FaLightbulb, FaListAlt, FaUsers, FaFileAlt } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';
import ssraLogo from '../../assets/ssra1-logo.png';


export default function Sidebar() {
  const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Kiểm tra user có phải admin không
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setIsAdmin(user.role === 'admin');
  }, []);

  const menu = [
    { label: 'Giới thiệu', icon: <FaInfoCircle />, path: '/gioi-thieu' },
    { label: 'Hồ sơ hệ thống', icon: <FaUser />, path: '/he-thong' },
    { label: 'Tài sản', icon: <FaFileAlt />, path: '/tai-san' },
    {
      label: 'Đánh giá rủi ro', icon: <FaClipboardList />, children: [
        { label: 'Lỗ hổng', icon: <FaBug />, path: '/danh-gia/lo-hong' },
        { label: 'Mối đe doạ', icon: <FaShieldAlt />, path: '/danh-gia/moi-de-doa' },
        { label: 'Các bên liên quan', icon: <FaUsers />, path: '/danh-gia/ben-lien-quan' },
        { label: 'Kịch bản chiến lược', icon: <FaLightbulb />, path: '/danh-gia/kich-ban-chien-luoc' },
        { label: 'Kịch bản vận hành', icon: <FaListAlt />, path: '/danh-gia/kich-ban-van-hanh' },
        { label: 'Kết quả đánh giá rủi ro', icon: <FaClipboardList />, path: '/danh-gia/ket-qua-danh-gia-rui-ro' },
      ]
    },
    { label: 'Lịch sử đánh giá', icon: <FaFileAlt />, path: '/lich-su' },
    { label: 'Thống kê', icon: <FaChartBar />, path: '/thong-ke' },
    ...(isAdmin ? [
      { label: 'Quản lý tài khoản', icon: <FiUsers />, path: '/quan-ly-tai-khoan' }
    ] : []),

    { label: 'Đăng xuất', icon: <FaSignOutAlt />, path: '/dang-xuat' }
  ];

  const handleToggle = (label) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div
      style={{
        width: 260,
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #19c6e6 0%, #a084e8 100%)',
        color: '#fff',
        boxShadow: '2px 0 16px #0001',
        padding: '32px 0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: 24
      }}>
        <img
          src={ssraLogo}
          alt="SSRA Logo"
          style={{ width: 120, height: 70, marginBottom: 8, borderRadius: 12, background: '#fff' }}
        />

        <div style={{
          fontWeight: 700,
          fontSize: 22,
          marginBottom: 36,
          textAlign: 'center',
          letterSpacing: 1,
          textShadow: '0 2px 8px #0002'
        }}>
          Hệ thống hỗ trợ đánh giá rủi ro
        </div>
      </div>
      <nav style={{ flex: 1 }}>
        {menu.filter(item => item.label !== 'Đăng xuất').map((item) => (
          <div key={item.label}>
            {item.children ? (
              <div>
                <div
                  onClick={() => handleToggle(item.label)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    padding: '14px 32px',
                    fontWeight: 600,
                    background: openMenus[item.label] ? 'rgba(255,255,255,0.10)' : 'transparent',
                    borderRadius: openMenus[item.label] ? '12px' : '0',
                    marginBottom: 2,
                    transition: 'background 0.2s'
                  }}
                  className="sidebar-parent"
                >
                  <span style={{ marginRight: 16, fontSize: 20 }}>{item.icon}</span>
                  {item.label}
                  <span style={{
                    marginLeft: 'auto',
                    fontSize: 14,
                    transform: openMenus[item.label] ? 'rotate(90deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s'
                  }}>▶</span>
                </div>
                {openMenus[item.label] && (
                  <div style={{ marginLeft: 12, marginTop: 2 }}>
                    {item.children.map(child => (
                      <Link
                        key={child.label}
                        to={child.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          color: '#fff',
                          textDecoration: 'none',
                          padding: '11px 28px',
                          fontWeight: location.pathname === child.path ? 700 : 400,
                          background: location.pathname === child.path ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
                          borderRadius: '10px',
                          marginBottom: 2,
                          marginLeft: 8,
                          boxShadow: location.pathname === child.path ? '0 2px 8px #a084e833' : 'none',
                          transition: 'background 0.2s, box-shadow 0.2s'
                        }}
                        className="sidebar-link"
                      >
                        <span style={{ marginRight: 12, fontSize: 16 }}>{child.icon}</span>
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '14px 32px',
                  fontWeight: location.pathname === item.path ? 700 : 400,
                  background: location.pathname === item.path ? 'rgba(255,255,255,0.18)' : 'transparent',
                  borderRadius: location.pathname === item.path ? '12px' : '0',
                  marginBottom: 2,
                  boxShadow: location.pathname === item.path ? '0 2px 8px #19c6e633' : 'none',
                  transition: 'background 0.2s, box-shadow 0.2s'
                }}
                className="sidebar-link"
              >
                <span style={{ marginRight: 16, fontSize: 18 }}>{item.icon}</span>
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
      <div style={{ marginTop: 'auto', padding: '0 0 40px 0' }}>
        {menu.filter(item => item.label === 'Đăng xuất').map(item => (
          <Link
            key={item.label}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              color: '#222',
              textDecoration: 'none',
              padding: '14px 32px',
              fontWeight: 700,
              background: location.pathname === item.path ? 'rgba(255,255,255,0.18)' : 'transparent',
              borderRadius: location.pathname === item.path ? '12px' : '0',
              marginBottom: 2,
              boxShadow: location.pathname === item.path ? '0 2px 8px #19c6e633' : 'none',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            className="sidebar-link"
          >
            <span style={{ marginRight: 16, fontSize: 18 }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}