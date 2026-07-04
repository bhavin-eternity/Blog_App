const express = require('express');
const router = express.Router();
const {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
} = require('../controllers/postController');
const protect = require('../middleware/authMiddleware');
const upload = require('../config/multer');

router.get('/', getAllPosts);
router.get('/:id', getPostById);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

module.exports = router;