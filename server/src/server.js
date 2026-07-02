require('dotenv').config()

const express = require('express')
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const app = express()

const PORT = process.env.PORT || 5000;

connectDB();

//middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send('Server is running')
});


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});