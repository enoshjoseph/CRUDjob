import React from 'react';
import type { Job } from '../types/details';

interface JobDetailsProps {
  job: Job;
}

const JobDetails: React.FC<JobDetailsProps> = ({ job }) => {
  return (
    <div className="mt-8 p-6 border rounded bg-gray-50">
      <h3 className="text-xl font-bold mb-2">{job.title}</h3>
      <p><strong>Department:</strong> {job.departmentName}</p>
      <p><strong>Requested by:</strong> {job.requestedByName}</p>
      <p><strong>Status:</strong> {job.status}</p>
      <p><strong>Description:</strong> {job.description}</p>
      <p><strong>Position Count:</strong> {job.positionCount}</p>
      <p><strong>Minimum Qualification:</strong> {job.minQualification}</p>
      <p><strong>Experience:</strong> {job.minExperience} years</p>
      <p><strong>Salary:</strong> ₹{job.salaryRange}</p>
      <p><strong>Requested On:</strong> {new Date(job.requestDate).toLocaleDateString()}</p>
    </div>
  );
};

export default JobDetails;
