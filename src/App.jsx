import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import PostGig from './pages/PostGig';
import GigDetails from './pages/GigDetails';
import UserProfile from './pages/UserProfile';
import EditProfile from './pages/EditProfile';
import Communities from './pages/Communities';
import Chat from './pages/Chat';
import Settings from './pages/Settings';
import Help from './pages/Help';
import SavedGigs from './pages/SavedGigs';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
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
              <Route 
                path="/profile/edit" 
                element={
                  <PrivateRoute>
                    <EditProfile />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/communities" 
                element={
                  <PrivateRoute>
                    <Communities />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/communities/:id" 
                element={
                  <PrivateRoute>
                    <Chat />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/help" 
                element={
                  <PrivateRoute>
                    <Help />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/saved-gigs" 
                element={
                  <PrivateRoute>
                    <SavedGigs />
                  </PrivateRoute>
                } 
              />
              {/* Add more routes here */}
            </Routes>
          </Layout>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
