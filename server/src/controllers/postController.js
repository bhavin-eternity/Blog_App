const Post = require('../models/Post')


// GET /api/posts — public
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name email')
            .sort({ createdAt: -1 });

        res.json(posts)
    } catch (error) {
        res.status(500).json({ message: error.message });

    }

}


// GET /api/posts/:id — public
const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email')

        if (!post) {
            res.status(404).json({ message: 'Post not found' });
        }

        res.json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/posts — protected
const createPost = async (req, res) => {
    const { title, content } = req.body;

    try {
        const post = await Post.create({
            title,
            content,
            image: req.file ? `/uploads/${req.file.filename}` : '',
            author: req.user._id,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}


// PUT /api/posts/:id — protected + author only

const updatePost = async (req, res) => {
    try {
        post = await Post.findById(req.params.id);

        if (!post) {
            res.status(404).json({ message: 'Post not found !' })
        }

        //check ownershop
        if (post.author.toString() !== req.user._id.toString()) {
            res.status(403).json({ message: 'Not authorized to edit this post' });
        }

        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        if (req.file) {
            post.image = `/uploads/${req.file.filename}`;
        }

        const updatedPost = await post.save();
        res.json(updatedPost)
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
}

// DELETE /api/posts/:id — protected + author only
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message })

    }
};

module.exports = { getAllPosts, getPostById, createPost, updatePost, deletePost };