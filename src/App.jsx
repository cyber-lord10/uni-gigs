import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PostGig from './pages/PostGig';
import GigDetails from './pages/GigDetails';
import UserProfile from './pages/UserProfile';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route 
              path="/" 
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/post-gig" 
              element={
                <PrivateRoute>
                  <PostGig />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/gigs/:id" 
              element={
                <PrivateRoute>
                  <GigDetails />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <UserProfile />
                </PrivateRoute>
              } 
            />
            {/* Add more routes here */}
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
