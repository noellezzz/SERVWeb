import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/admin/Login';
// ...other imports...

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/login' element={<Login />} />
        {/* ...other routes... */}
      </Routes>
    </Router>
  );
};

export default App;
