import Post from '../models/Post.js';
import Comment from '../models/Comment.js';

export const createPost = async (req, res) => {
    const { text, imageUrl } = req.body;
    try {
        const newPost = new Post({ 
            text, 
            imageUrl: imageUrl || '',
            author: req.user.id 
        });
        const post = await newPost.save();
        await post.populate('author', 'name profilePicture');
        res.status(201).json(post);
    } catch (err) {
        console.error(err); // ADDED THIS LINE
        res.status(500).send('Server Error');
    }
};

export const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name profilePicture' }
            })
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err); // ADDED THIS LINE
        res.status(500).send('Server Error');
    }
};

export const getPostsByUserId = async (req, res) => {
    try {
        const posts = await Post.find({ author: req.params.userId })
            .populate('author', 'name profilePicture')
            .populate({
                path: 'comments',
                populate: { path: 'author', select: 'name profilePicture' }
            })
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        console.error(err); // ADDED THIS LINE
        res.status(500).send('Server Error');
    }
};

export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        if (post.likes.includes(req.user.id)) {
            post.likes = post.likes.filter(userId => userId.toString() !== req.user.id.toString());
        } else {
            post.likes.push(req.user.id);
        }
        await post.save();
        res.json(post.likes);
    } catch (err) {
        console.error(err); // ADDED THIS LINE
        res.status(500).send('Server Error');
    }
};

export const addComment = async (req, res) => {
    const { text } = req.body;
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ msg: 'Post not found' });
        
        const newComment = new Comment({
            text,
            author: req.user.id,
            post: req.params.id
        });

        const comment = await newComment.save();
        post.comments.push(comment._id);
        await post.save();
        
        await comment.populate('author', 'name profilePicture');

        res.status(201).json(comment);
    } catch (err) {
        console.error(err); // ADDED THIS LINE
        res.status(500).send('Server Error');
    }
};

export const getCommentsForPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.id })
            .populate('author', 'name profilePicture')
            .sort({ createdAt: 'asc' });
        res.json(comments);
    } catch (err) {
        console.error(err); // ADDED THIS LINE
        res.status(500).send('Server Error');
    }
};