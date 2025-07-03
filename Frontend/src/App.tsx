import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JobRequestPage from './pages/JobRequestPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 p-4">
        <Routes>
          <Route path="/" element={<JobRequestPage />} />
          {/* Add more routes here if needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
