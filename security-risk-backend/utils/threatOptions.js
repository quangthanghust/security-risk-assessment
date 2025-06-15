module.exports.THREAT_OPTIONS = {
    "Mối đe dọa vật lý": [
        { code: "TP01", description: "Hỏa hoạn" },
        { code: "TP02", description: "Nước (ngập lụt, rò rỉ...)" },
        { code: "TP03", description: "Ô nhiễm, bức xạ có hại" },
        { code: "TP04", description: "Tai nạn lớn" },
        { code: "TP05", description: "Nổ" },
        { code: "TP06", description: "Bụi, ăn mòn, đóng băng" }
      ],
      "Mối đe dọa tự nhiên": [
        { code: "TN01", description: "Hiện tượng khí hậu" },
        { code: "TN02", description: "Hiện tượng động đất" },
        { code: "TN03", description: "Hiện tượng núi lửa" },
        { code: "TN04", description: "Hiện tượng khí tượng" },
        { code: "TN05", description: "Lũ lụt" },
        { code: "TN06", description: "Dịch bệnh/Pandemic" }
      ],
      "Thất bại hạ tầng": [
        { code: "TI01", description: "Hỏng hệ thống cung cấp" },
        { code: "TI02", description: "Hỏng hệ thống làm mát/thông gió" },
        { code: "TI03", description: "Mất nguồn điện" },
        { code: "TI04", description: "Hỏng mạng viễn thông" },
        { code: "TI05", description: "Hỏng thiết bị viễn thông" },
        { code: "TI06", description: "Bức xạ điện từ" },
        { code: "TI07", description: "Bức xạ nhiệt" },
        { code: "TI08", description: "Xung điện từ" }
      ],
      "Thất bại kỹ thuật": [
        { code: "TT01", description: "Hỏng thiết bị hoặc hệ thống" },
        { code: "TT02", description: "Quá tải hệ thống thông tin" },
        { code: "TT03", description: "Vi phạm khả năng bảo trì hệ thống thông tin" }
      ],
      "Hành động con người": [
        { code: "TH01", description: "Tấn công khủng bố, phá hoại" },
        { code: "TH02", description: "Kỹ thuật xã hội" },
        { code: "TH03", description: "Đánh chặn bức xạ từ thiết bị" },  
        { code: "TH04", description: "Gián điệp từ xa" },
        { code: "TH05", description: "Nghe lén" },
        { code: "TH06", description: "Trộm cắp phương tiện hoặc tài liệu" },
        { code: "TH07", description: "Trộm cắp thiết bị" },
        { code: "TH08", description: "Trộm cắp danh tính số hoặc thông tin xác thực" },
        { code: "TH09", description: "Thu hồi phương tiện đã tái chế hoặc loại bỏ" },
        { code: "TH10", description: "Rò rỉ thông tin" },
        { code: "TH11", description: "Nhập dữ liệu từ nguồn không đáng tin cậy" },
        { code: "TH12", description: "Can thiệp phần cứng" },
        { code: "TH13", description: "Can thiệp phần mềm" },
        { code: "TH14", description: "Tấn công qua giao tiếp web" },
        { code: "TH15", description: "Tấn công lặp lại, man-in-the-middle" },
        { code: "TH16", description: "Xử lý dữ liệu cá nhân trái phép" },
        { code: "TH17", description: "Truy cập trái phép vào cơ sở vật chất" },
        { code: "TH18", description: "Sử dụng thiết bị trái phép" },
        { code: "TH19", description: "Sử dụng thiết bị không đúng cách" },
        { code: "TH20", description: "Làm hỏng thiết bị hoặc phương tiện" },
        { code: "TH21", description: "Sao chép phần mềm gian lận" },
        { code: "TH22", description: "Sử dụng phần mềm giả mạo" },
        { code: "TH23", description: "Làm hỏng dữ liệu" },
        { code: "TH24", description: "Xử lý dữ liệu bất hợp pháp" },
        { code: "TH25", description: "Phát tán phần mềm độc hại" },
        { code: "TH26", description: "Định vị vị trí" }
      ],
      "Thỏa hiệp chức năng hoặc dịch vụ": [
        { code: "TC01", description: "Lỗi khi sử dụng" },
        { code: "TC02", description: "Lạm dụng quyền hoặc phân quyền" },
        { code: "TC03", description: "Giả mạo quyền hoặc phân quyền" },
        { code: "TC04", description: "Từ chối thực hiện hành động" }
      ],
      "Mối đe dọa tổ chức": [
        { code: "T001", description: "Thiếu nhân sự" },
        { code: "T002", description: "Thiếu nguồn lực" },
        { code: "T003", description: "Nhà cung cấp dịch vụ thất bại" },
        { code: "T004", description: "Vi phạm luật hoặc quy định" }
      ],
      "Khác": []
  };

  function isValidThreat(category, code, description) {
    const options = module.exports.THREAT_OPTIONS[category];
    if (!options) return false;
    if (category === "Khác") return !!description;
    return options.some(item => item.code === code && item.description === description);
  }
  
  module.exports.isValidThreat = isValidThreat;