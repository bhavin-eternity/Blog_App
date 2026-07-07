import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"


const SignUp = () => {
  const { login } = useAuth();
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',

  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await api.post('/auth/signup', formData)
      login(data);
      navigate('/')
    } catch (error) {
      setError(error.response?.data?.message ||
        error.message ||
        'Something went wrong!')
    } finally {
      setLoading(false)
    }
  }
  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Create an Account</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        <p>Already have an account? <Link to="/login">Log in</Link></p>

      </form>

    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    width: '100%',
    maxWidth: '400px',
    padding: '32px',
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '10px 12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  button: {
    padding: '10px',
    fontSize: '16px',
    background: '#333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    color: 'red',
    fontSize: '14px',
  },
};

export default SignUp
