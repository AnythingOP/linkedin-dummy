import Post from '../models/Post.js';
import User from '../models/User.js';

export const createPost = async (req, res) => {
    const { text, authorId } = req.body;
    try {
        const author = await User.findById(authorId);
        if (!author) return res.status(404).json({ msg: 'Author not found' });
        const newPost = new Post({ text, author: authorId });
        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('author', ['name']).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

export const getPostsByUserId = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId }).populate('author', ['name']).sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};