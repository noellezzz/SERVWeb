import './App.css';
import 'regenerator-runtime/runtime';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import Layout from './layouts/user/Layout';
import AdminLayout from './layouts/admin/AdminLayout';

// USER PAGES
import Home from './pages/users/Home';
import Evaluation from './pages/users/Evaluation/index.jsx';
import Services from './pages/users/Services';
import About from './pages/users/About';
import Contact from './pages/users/Contact';

// New User Pages
import AfterFeedback from './pages/users/Evaluation/AfterFeedback'; // New Import
import Test from './pages/users/test'; // Ensure the Test component is imported correctly

// ADMIN PAGES
import Dashboard from './pages/admin/Dashboard';
import AssessmenstPage from './pages/admin/Assessments';
import AsssessmentView from './pages/admin/Assessments/AsssessmentView';
import Visualizer from './pages/admin/Visualizer';
import Users from './pages/admin/Users';
import ReportsPage from './pages/admin/Reports';
import FeedbacksPage from './pages/admin/Feedbacks';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import Notifications from './pages/admin/Notifications';
import Profile from './pages/admin/Profile';
import Login from './pages/admin/Login';

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
        <Route path='evaluation' element={<Evaluation />} />
        <Route path='evaluation/after-feedback' element={<AfterFeedback />} /> {/* New Route */}
        <Route path='services' element={<Services />} />
        <Route path='about' element={<About />} />
        <Route path='contact' element={<Contact />} />
        <Route path='test' element={<Test />} /> {/* New Route */}
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
