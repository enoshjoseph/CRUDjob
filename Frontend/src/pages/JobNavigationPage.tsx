import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Briefcase, Edit, Eye } from 'lucide-react';

const JobNavigationPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50 px-6">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-xl w-full border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
          Job Management Console
        </h1>

        <div className="space-y-5">
          <Button
            onClick={() => navigate('/job-request')}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 text-lg flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Briefcase className="w-5 h-5" />
            Post New Job Request
          </Button>

          <Button
            onClick={() => navigate('/job-update')}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 text-lg flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Eye className="w-5 h-5" />
            View & Manage Job Requests
          </Button>

          <Button
            onClick={() => navigate('/job-edit')}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-white py-3 text-lg flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Edit className="w-5 h-5" />
            Edit Existing Jobs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobNavigationPage;
