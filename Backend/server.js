const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require('./auth');
const dreamRoutes = require('./dreams');

app.use('/auth', authRoutes);
app.use('/dreams', dreamRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
