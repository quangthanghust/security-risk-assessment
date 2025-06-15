const RiskAcceptanceCriteria = require('../models/RiskAcceptanceCriteria');

async function seedDefaultCriteria() {
  const count = await RiskAcceptanceCriteria.countDocuments();
  if (count === 0) {
    await RiskAcceptanceCriteria.create({
      name: 'Tiêu chí mặc định',
      description: 'Theo chuẩn ISO/IEC 27005',
      criteria: [
        { riskLevel: 'Rất cao', evaluation: 'Không chấp nhận', description: 'Phải xử lý ngay' },
        { riskLevel: 'Cao', evaluation: 'Không chấp nhận', description: 'Chuyển giao rủi ro/ giảm thiểu' },
        { riskLevel: 'Trung bình', evaluation: 'Chấp nhận có kiểm soát', description: 'Nên giảm thiểu' },
        { riskLevel: 'Thấp', evaluation: 'Chấp nhận', description: 'Có thể chấp nhận' },
        { riskLevel: 'Rất thấp', evaluation: 'Chấp nhận', description: 'Có thể chấp nhận' }
      ]
    });
    console.log('Seeded default RiskAcceptanceCriteria');
  }
}

module.exports = seedDefaultCriteria;