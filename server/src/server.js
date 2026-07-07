require('dotenv').config()
const path = require('path');
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const commentRoutes = require('./routes/commentRoutes');
const app = express()

const PORT = process.env.PORT || 5000;

connectDB();

//middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Server is running')
});


app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});