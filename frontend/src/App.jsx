import './App.css';
import 'regenerator-runtime/runtime';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import Layout from './layouts/user/Layout.jsx';
import AdminLayout from './layouts/admin/AdminLayout.jsx';

// USER PAGES
import Home from './pages/users/Home.jsx';
import Evaluation from './pages/users/Evaluation/index.jsx';
import Services from './pages/users/Services.jsx';
import About from './pages/users/About.jsx';
import Contact from './pages/users/Contact.jsx';
import { Login as UserLogin, Signup } from './pages/users/Auth';
import UserInfo from './pages/users/Auth/UserInfo.jsx';
import AfterFeedback from './pages/users/Evaluation/AfterFeedback.jsx'; 

// USER DASHBOARD PAGES
import UserDashboard from './pages/users/Pages/index.jsx';
import UserProfile from './pages/users/Pages/Profile.jsx';
import UserResults from './pages/users/Pages/Results.jsx';
import UserFeedbacks from './pages/users/Pages/Feedbacks.jsx';

// ADMIN PAGES
import Dashboard from './pages/admin/Dashboard/index.jsx';
import AssessmenstPage from './pages/admin/Assessments/index.jsx';
import AsssessmentView from './pages/admin/Assessments/AsssessmentView.jsx';
import Visualizer from './pages/admin/Visualizer/index.jsx';
import Users from './pages/admin/Users.jsx';
import ReportsPage from './pages/admin/Reports/index.jsx';
import FeedbacksPage from './pages/admin/Feedbacks/index.jsx';
import Analytics from './pages/admin/Analytics/index.jsx';
import Settings from './pages/admin/Settings/index.jsx';
import Notifications from './pages/admin/Notifications.jsx';
import Profile from './pages/admin/Profile.jsx';
import Login from './pages/admin/Login/index.jsx';

// Test Components
import TestsPage from './components/tests/index.jsx';

// Error Page
import ErrorPage from './components/error-page';

// Protected Route Component for signup flow
const ProtectedSignupRoute = () => {
  const registrationStep = useSelector((state) => state?.signup?.registrationStep);
  
  // Only allow access if the user has completed the basic info step
  return registrationStep === 'basic-info' ? <Outlet /> : <Navigate to='/signup' replace />;
};

// Protected Route Component using Redux state
const ProtectedRoute = () => {
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);

  if (isAuthenticated === undefined) return <div>Loading...</div>; // Handle undefined state

  return isAuthenticated ? <Outlet /> : <Navigate to='/admin/login' replace />;
};

// Protected Route Component for users
const ProtectedUserRoute = () => {
  const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);

  if (isAuthenticated === undefined) return <div>Loading...</div>; // Handle undefined state

  return isAuthenticated ? <Outlet /> : <Navigate to='/login' replace />;
};

function App() {
  return (
    <Routes>
      {/* Test Route - easily accessible without authentication */}
      <Route path="/tests" element={<TestsPage />} />
      
      {/* User Routes */}
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='login' element={<UserLogin />} />
        <Route path='signup' element={<Signup />} />
        
        {/* Protected UserInfo route */}
        <Route element={<ProtectedSignupRoute />}>
          <Route path='userinfo' element={<UserInfo />} />
        </Route>
        
        <Route path='evaluation' element={<Evaluation />} />
        <Route path='evaluation/after-feedback' element={<AfterFeedback />} />
        <Route path='services' element={<Services />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        
        {/* User Dashboard Pages - Protected */}
        <Route element={<ProtectedUserRoute />}>
          <Route path='dashboard' element={<UserDashboard />} />
          <Route path='profile' element={<UserProfile />} />
          <Route path='results' element={<UserResults />} />
          <Route path='feedbacks' element={<UserFeedbacks />} />
        </Route>
        
        {/* Not Found route for user section */}
        <Route path="*" element={<ErrorPage />} />
      </Route>

      {/* Admin Login Route */}
      <Route path='/admin/login' element={<Login />} />

      {/* Protected Admin Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path='/admin' element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='users' element={<Users />} />
          <Route path='assessments' element={<AssessmenstPage />} />
          <Route path='assessments/:assessmentId' element={<AsssessmentView />} />
          <Route path='feedbacks' element={<FeedbacksPage />} />
          <Route path='reports' element={<ReportsPage />} />
          <Route path='analytics' element={<Analytics />} />
          <Route path='visualizer' element={<Visualizer />} />
          <Route path='settings' element={<Settings />} />
          <Route path='notifications' element={<Notifications />} />
          <Route path='profile' element={<Profile />} />
          
          {/* Not Found route for admin section */}
          <Route path="*" element={<ErrorPage 
            title="Admin Page Not Found" 
            message="Sorry, the admin page you're looking for doesn't exist." 
            btnText="Back to Dashboard"
          />} />
        </Route>
      </Route>
      
      {/* Global catch-all route */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
}

export default App;