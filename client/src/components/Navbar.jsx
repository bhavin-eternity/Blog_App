import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    return (
        <nav style={styles.nav}>
            <Link to="/" style={styles.brand}>
                BlogApp
            </Link>

            <div style={styles.links}>
                {user ? (
                    <>
                        <span style={styles.username}>Hi, {user.name}</span>
                        <Link to="/create" style={styles.link}>
                            Create Post
                        </Link>
                        <button onClick={handleLogout} style={styles.logoutBtn}>
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>
                            Login
                        </Link>
                        <Link to="/signup" style={styles.link}>
                            Signup
                        </Link>
                    </>
                )}
            </div>

        </nav>
    );
};

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 32px',
        background: 'white',
        boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
    },
    brand: {
        fontWeight: 'bold',
        fontSize: '20px',
        textDecoration: 'none',
        color: '#333',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    link: {
        textDecoration: 'none',
        color: '#333',
        fontSize: '15px',
    },
    username: {
        fontSize: '14px',
        color: '#888',
    },
    logoutBtn: {
        background: 'none',
        border: '1px solid #333',
        borderRadius: '4px',
        padding: '6px 12px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default Navbar
