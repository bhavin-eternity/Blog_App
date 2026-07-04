const Comment = require('../models/Comment');
const Post = require('../models/Post');

// GET /api/posts/:postId/comments — public
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate('author', 'name email')
            .sort({ createdAt: 1 });

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
};

// POST /api/posts/:postId/comments

const addComment = async (req, res) => {
    const { content } = req.body;

    try {
        const post = await Post.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            content,
            author: req.user._id,
            post: req.params.postId,
        });

        await comment.populate('author', 'name email');
        res.status(201).json(comment);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// DELETE /api/posts/:postId/comments/:commentId

const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.commentId);

        if (!comment) {
            res.status(404).json({ message: 'Comment not found!' })
        }

        if (comment.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        await comment.deleteOne();
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

module.exports = { getComments, addComment, deleteComment };