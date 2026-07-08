import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const EditPost = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const [existingImage, setExistingImage] = useState('');
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchpost = async () => {
      try {
        const { data } = await api.get(`/posts/${id}`);

        if (data.author._id !== user?._id) {
          navigate('/');
          return;
        }

        setFormData({
          title: data.title,
          content: data.content,
        });
        setExistingImage(data.image);
      } catch (error) {
        setError('Failed to load the post!')
      } finally {
        setLoading(false);
      }
    };
    fetchpost();
  }, [id])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('content', formData.content);
      // Only append image if user picked a new one
      if (newImage) {
        data.append('image', newImage);
      }

      await api.put(`/posts/${id}`, data);
      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update post');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Edit Post</h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.field}>
          <label style={styles.label}>Title</label>
          <input
            style={styles.input}
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
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
            rows={10}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Cover Image</label>

          {/* Show existing image if there is one and no new preview yet */}
          {existingImage && !preview && (
            <div>
              <p style={styles.currentLabel}>Current image:</p>
              <img
                src={existingImage}
                alt="current"
                style={styles.preview}
              />
            </div>
          )}

          {/* Show preview of newly selected image */}
          {preview && (
            <div>
              <p style={styles.currentLabel}>New image:</p>
              <img
                src={preview}
                alt="new preview"
                style={styles.preview}
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: '8px' }}
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Changes'}
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
    width: '100%',
    maxHeight: '200px',
    objectFit: 'cover',
    borderRadius: '4px',
    marginTop: '6px',
  },
  currentLabel: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '4px',
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

export default EditPost
