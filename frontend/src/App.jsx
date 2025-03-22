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
import Test from './pages/users/test.jsx';

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

function App() {
  return (
    <Routes>
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
        <Route path='test' element={<Test />} />
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
        </Route>
      </Route>
    </Routes>
  );
}

export default App;