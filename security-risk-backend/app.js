const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Kết nối MonggoDB
const cors = require('cors');

// Load biến môi trường
dotenv.config();

// Kết nối MongoDB
connectDB();

const app = express();

// Middlewares
app.use(express.json());
const allowedOrigins = [
  'https://security-risk-assessment.vercel.app', // domain frontend trên Vercel
  'http://localhost:3000' // cho phép cả local để dev
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // dùng xác thực
}));
const seedRiskAcceptanceCriteria = require('./utils/seedRiskAcceptanceCriteria');
seedRiskAcceptanceCriteria();

const seedRiskSource = require('./utils/seedRiskSource');
seedRiskSource();

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const systemProfileRoutes = require('./routes/systemProfileRoutes');
app.use('/api/system-profiles', systemProfileRoutes);

const assetRoutes = require('./routes/assetRoutes');
app.use('/api/assets', assetRoutes);

const vulnerabilityRoutes = require('./routes/vulnerabilityRoutes');
app.use('/api/vulnerabilities', vulnerabilityRoutes);

const threatRoutes = require('./routes/threatRoutes');
app.use('/api/threats', threatRoutes);

const riskSourceRoutes = require('./routes/riskSourceRoutes');
app.use('/api/risk-sources', riskSourceRoutes);

const interestedPartyRoutes = require('./routes/interestedPartyRoutes');
app.use('/api/interested-parties', interestedPartyRoutes);

const strategicScenarioRoutes = require('./routes/strategicScenarioRoutes');
app.use('/api/strategic-scenarios', strategicScenarioRoutes);

const operationScenarioRoutes = require('./routes/operationScenarioRoutes');
app.use('/api/operation-scenarios', operationScenarioRoutes);

const riskItemRoutes = require('./routes/riskItemRoutes');
app.use('/api/risk-items', riskItemRoutes);

const riskAcceptanceCriteriaRoutes = require('./routes/riskAcceptanceCriteriaRoutes');
app.use('/api/risk-acceptance-criteria', riskAcceptanceCriteriaRoutes);

const weightConfigRoutes = require('./routes/weightConfigRoutes');
app.use('/api/weight-configs', weightConfigRoutes);

const reportRoutes = require('./routes/reportRoutes');
app.use('/api/reports', reportRoutes);

const statisticsRoutes = require('./routes/statisticsRoutes');
app.use('/api/statistics', statisticsRoutes);

const WeightConfig = require('./models/WeightConfig');
WeightConfig.findOne().then(config => {
  if (!config) {
    WeightConfig.create({
      name: "Default",
      consequenceWeights: {
        assetValue: 0.3,
        impactTypeLevel: 0.25,
        interestedPartiesLevel: 0.15,
        dependency: 0.15,
        lossMagnitude: 0.15
      },
      likelihoodWeights: {
        vulnerabilityLevel: 0.3,
        threatLevel: 0.25,
        controlEffectiveness: 0.2,
        exposureFrequency: 0.15,
        detectability: 0.1
      }
    }).then(() => console.log('Đã tạo trọng số mặc định!'));
  }
});

// Xử lý lỗi 404
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));