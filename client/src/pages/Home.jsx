import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchposts = async () => {
            try {
                const { data } = await api.get('/posts')
                setPosts(data)
            } catch (error) {
                setError('Failed to load posts');
            } finally {
                setLoading(false)
            };
        }

        fetchposts();
    }, [])

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (posts.length === 0) return <p>No posts yet. Be the first to write one!</p>;

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Latest Posts</h1>
            <div style={styles.grid}>
                {posts.map((post) => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
        </div>
    );
};


const PostCard = ({ post }) => {
    return (
        <div style={styles.card}>
            {post.image && (
                <img
                    src={post.image}
                    alt={post.title}
                    style={styles.image}
                />
            )}
            <div style={styles.cardBody}>
                <h2 style={styles.title}>{post.title}</h2>
                <p style={styles.meta}>
                    By {post.author?.name} · {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <p style={styles.excerpt}>
                    {post.content.substring(0, 120)}...
                </p>
                <Link to={`/posts/${post._id}`} style={styles.readMore}>
                    Read more →
                </Link>
            </div>
        </div>
    );
};

const styles = {
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
    },
    card: {
        background: 'white',
        borderRadius: '8px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    },
    image: {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
    },
    cardBody: {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    title: {
        fontSize: '20px',
        fontWeight: 'bold',
    },
    meta: {
        fontSize: '13px',
        color: '#888',
    },
    excerpt: {
        fontSize: '15px',
        color: '#555',
        lineHeight: '1.5',
    },
    readMore: {
        textDecoration: 'none',
        color: '#333',
        fontWeight: 'bold',
        fontSize: '14px',
        marginTop: '4px',
    },
};
 

export default Home
