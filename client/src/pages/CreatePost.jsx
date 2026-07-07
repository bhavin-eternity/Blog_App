import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    // Create a local preview URL so user sees the image before uploading
    setPreview(URL.createObjectURL(file));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title)
      data.append('content', formData.content)
      if (image) {
        data.append('image', image);
      }



      const { data: post } = await api.post('/posts', data);
      navigate(`/posts/${post._id}`);
    } catch (error) {
      console.log(error.response?.data);
      console.log(error);

      setError(error.response?.data?.message ||
        error?.message ||
        'Failed to create post');
    } finally {
      setLoading(false);
    }

  };
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Create New Post</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handlesubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Post title"
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Content</label>
          <textarea
            style={styles.textarea}
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your post..."
            rows={10}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Cover Image (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* Show preview as soon as user picks a file */}
          {preview && (
            <img
              src={preview}
              alt="preview"
              style={styles.preview}
            />
          )}
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={loading}
        >
          {loading ? 'Publishing...' : 'Publish Post'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    background: 'white',
    borderRadius: '8px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  heading: {
    marginBottom: '24px',
    fontSize: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#555',
  },
  input: {
    padding: '10px 12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  textarea: {
    padding: '10px 12px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    resize: 'vertical',
    fontFamily: 'sans-serif',
    lineHeight: '1.6',
  },
  preview: {
    marginTop: '10px',
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    background: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    alignSelf: 'flex-start',
  },
  error: {
    color: 'red',
    fontSize: '14px',
    marginBottom: '8px',
  },
};

export default CreatePost
