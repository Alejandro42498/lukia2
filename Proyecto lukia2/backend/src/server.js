const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// serve frontend static from frontend/public
app.use(express.static(path.join(__dirname, '../../frontend/public')));

// API routes
app.use('/api/users', require('./routes/users'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
