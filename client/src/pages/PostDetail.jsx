import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {


      try {
        const [postRes, commentsRes] = await Promise.all([
          api.get(`/posts/${id}`),
          api.get(`/posts/${id}/comments`),
        ]);

        setPost(postRes.data);
        setComments(commentsRes.data);
      } catch (error) {
        setError('Post not found');
      } finally {
        setLoading(false);
      }

    }
    fetchData();
  }, [id]);


  //delete post

  const handleDeletePost = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.delete(`/posts/${id}`);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete post');
    }
  };

  //add a comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);

    try {
      const { data } = await api.post(`/posts/${id}/comments`, {
        content: commentText,
      });
      setComments([...comments, data]);
      setCommentText('');
    } catch (error) {
      alert(err.response?.data?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  }

  //delete comment

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;

    try {
      await api.delete(`/posts/${id}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete comment');
    }
  }

  if (loading) return <p>Loading post...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!post) return null;

  const isAuthor = user && post.author._id === user._id;
  return (
    <div>
      <div style={styles.post}>
        {post.image && (
          <img
            src={`http://localhost:5000${post.image}`}
            alt={post.title}
            style={styles.coverImage}
          />
        )}
        <div style={styles.postBody}>
          <h1 style={styles.title}>{post.title}</h1>

          <div style={styles.meta}>
            <span>By {post.author?.name}</span>
            <span>·</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          {isAuthor && (
            <div style={styles.actions}>
              <Link to={`/edit/${post._id}`} style={styles.editBtn}>
                Edit
              </Link>
              <button onClick={handleDeletePost} style={styles.deleteBtn}>
                Delete
              </button>
            </div>
          )}

          <p style={styles.content}>{post.content}</p>
        </div>
      </div>

      {/* Comments Section */}
      <div style={styles.commentsSection}>
        <h2 style={styles.commentsTitle}>
          Comments ({comments.length})
        </h2>

        {user ? (
          <form onSubmit={handleAddComment} style={styles.commentForm}>
            <textarea
              style={styles.textarea}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              required
            />
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={submitting}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p style={styles.loginPrompt}>
            <Link to="/login">Log in</Link> to leave a comment
          </p>
        )}

        {/* Comments list */}
        {comments.length === 0 ? (
          <p style={styles.noComments}>
            No comments yet. Be the first!
          </p>
        ) : (
          <div style={styles.commentsList}>
            {comments.map((comment) => (
              <div key={comment._id} style={styles.comment}>
                <div style={styles.commentHeader}>
                  <span style={styles.commentAuthor}>
                    {comment.author?.name}
                  </span>
                  <span style={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>

                  {/* Delete button only for comment's own author */}
                  {user && comment.author?._id === user._id && (
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      style={styles.deleteCommentBtn}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p style={styles.commentContent}>{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


const styles = {
  post: {
    background: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    marginBottom: '32px',
  },
  coverImage: {
    width: '100%',
    height: '300px',
    objectFit: 'cover',
  },
  postBody: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
  },
  meta: {
    display: 'flex',
    gap: '8px',
    color: '#888',
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  editBtn: {
    padding: '6px 16px',
    background: '#333',
    color: 'white',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '14px',
  },
  deleteBtn: {
    padding: '6px 16px',
    background: 'white',
    color: 'red',
    border: '1px solid red',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  content: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: '#444',
  },
  commentsSection: {
    background: 'white',
    borderRadius: '8px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  commentsTitle: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '28px',
  },
  textarea: {
    padding: '10px 12px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
    fontFamily: 'sans-serif',
  },
  submitBtn: {
    alignSelf: 'flex-end',
    padding: '8px 20px',
    background: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  loginPrompt: {
    marginBottom: '24px',
    color: '#888',
    fontSize: '14px',
  },
  noComments: {
    color: '#888',
    fontSize: '14px',
  },
  commentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  comment: {
    borderTop: '1px solid #eee',
    paddingTop: '16px',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px',
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: '14px',
  },
  commentDate: {
    fontSize: '12px',
    color: '#aaa',
  },
  deleteCommentBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: 'red',
    cursor: 'pointer',
    fontSize: '12px',
  },
  commentContent: {
    fontSize: '15px',
    color: '#444',
    lineHeight: '1.6',
  },
};

export default PostDetail
