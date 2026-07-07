import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '800px', margin: '32px auto', padding: '0 16px' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>} />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </>
  )
}

export default App
