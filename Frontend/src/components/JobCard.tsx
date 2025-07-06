import React from 'react';
import type { Job } from '../types/details';
import Button from './Button';

interface JobCardProps {
  job: Job;
  onClick: () => void;
  onDelete?: () => void;
  showEditOnly?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onClick, onDelete, showEditOnly }) => {
  return(
    <div className="border rounded p-4 shadow hover:shadow-md transition relative">
      <div onClick={onClick} className="cursor-pointer">
        <h3 className="text-lg font-semibold">{job.title}</h3>
        <p className="text-sm text-gray-600">Department: {job.departmentName}</p>
        <p className="text-sm text-gray-600">Requested by: {job.requestedByName}</p>
        <p className="text-sm text-gray-500">Status: {job.status}</p>
      </div>

      <div className="mt-4">
        {showEditOnly ? (
          <Button
            onClick={onClick}
            className="w-full bg-yellow-100 text-yellow-800 border border-yellow-500 hover:bg-yellow-200"
          >
            Edit
          </Button>
        ) : (
          <Button
            onClick={onDelete}
            className="w-full bg-red-100 text-red-700 border border-red-500 hover:bg-red-200"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

export default JobCard;
