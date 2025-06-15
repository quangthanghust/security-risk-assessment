import React from 'react';

export default function HomePage() {
  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#fff0f6',
        padding: 0,
        margin: 0
      }}
    >
      <h2 style={{
        color: '#19c6e6',
        fontWeight: 700,
        fontSize: 36,
        marginBottom: 24,
        marginTop: 40,
        letterSpacing: 0.5,
        textAlign: 'center'
      }}>
        Hệ thống hỗ trợ đánh giá rủi ro an toàn thông tin cho ứng dụng Web
      </h2>
      <p style={{
        fontSize: 20,
        marginBottom: 32,
        maxWidth: 950,
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center'
      }}>
        Đây là công cụ giúp tổ chức, doanh nghiệp thực hiện đánh giá rủi ro an toàn thông tin cho các ứng dụng web theo chuẩn <b>ISO/IEC 27005:2022</b>. Hệ thống hỗ trợ nhận diện tài sản, lỗ hổng, mối đe dọa, xây dựng kịch bản rủi ro, đánh giá mức độ rủi ro và đề xuất các biện pháp kiểm soát phù hợp.
      </p>
      <div style={{
        marginBottom: 40,
        maxWidth: 950,
        marginLeft: 'auto',
        marginRight: 'auto',
        background: 'none'
      }}>
        <b style={{ color: '#a084e8', fontSize: 22 }}>Các bước sử dụng hệ thống:</b>
        <ol style={{ fontSize: 18, marginTop: 12, marginBottom: 0 }}>
          <li><b>Bước 1:</b> Quản lý tài sản, lỗ hổng, mối đe dọa, các bên liên quan và kịch bản vận hành.</li>
          <li><b>Bước 2:</b> Thực hiện đánh giá rủi ro cho từng kịch bản, xác định mức độ rủi ro và tiêu chí chấp nhận.</li>
          <li><b>Bước 3:</b> Xem báo cáo tổng hợp, nhận khuyến nghị kiểm soát để giảm thiểu rủi ro.</li>
        </ol>
      </div>
      <div style={{
        display: 'flex',
        gap: 48,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 16,
        marginBottom: 32,
        flexWrap: 'wrap'
      }}>
        <div style={{ textAlign: 'center', minWidth: 180 }}>
          <div style={{ fontSize: 56, color: '#19c6e6', marginBottom: 8 }}>🔒</div>
          <div style={{ fontSize: 18 }}>Đánh giá rủi ro toàn diện</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 180 }}>
          <div style={{ fontSize: 56, color: '#a084e8', marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 18 }}>Báo cáo & khuyến nghị tự động</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: 180 }}>
          <div style={{ fontSize: 56, color: '#19c6e6', marginBottom: 8 }}>🛡️</div>
          <div style={{ fontSize: 18 }}>Tuân thủ ISO/IEC 27005:2022</div>
        </div>
      </div>
    </div>
  );
}