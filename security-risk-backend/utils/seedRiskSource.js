const RiskSource = require('../models/RiskSource');

async function seedRiskSource() {
  const count = await RiskSource.countDocuments();
  if (count === 0) {
    await RiskSource.create([
      { type: 'Cố ý', name: 'Cố ý', description: 'Nguồn rủi ro do con người cố ý gây ra' },
      { type: 'Vô ý', name: 'Vô ý', description: 'Nguồn rủi ro do con người vô ý gây ra' },
      { type: 'Môi trường', name: 'Môi trường', description: 'Nguồn rủi ro từ môi trường tự nhiên' }
    ]);
    console.log('Seeded RiskSource');
  }
}
module.exports = seedRiskSource;