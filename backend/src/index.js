const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bills', require('./routes/bills'));
app.use('/api/bills/:billId/line-items', require('./routes/billLineItems'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/technicians', require('./routes/technicians'));
app.use('/api/settings', require('./routes/settings'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});

const PORT = process.env.PORT || 8000;

// Start server
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}); 