import React, { useEffect, useState } from 'react';
import axios from 'axios';
import clsx from 'clsx';
import type { Job, JobStatus } from '../types/details';
import JobCard from '../components/JobCard';
import JobDetails from '../components/JobDetails';
import Button from '../components/Button';

interface ApiResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: Job[];
}

const JobUpdatePage: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('Pending');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const pageSize = 2;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get<ApiResponse>(
          `http://localhost:5095/api/JobRequest?page=${currentPage}&pageSize=${pageSize}`
        );
        setJobs(res.data.data);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, [currentPage]);

  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this job request?');
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5095/api/JobRequest/${jobId}`);
      setJobs((prev) => prev.filter((job) => job.requestId !== jobId));
      if (selectedJobId === jobId) setSelectedJobId(null);
      alert('Job deleted successfully.');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete job.');
    }
  };

  const filteredJobs = jobs.filter((job) => job.status === selectedStatus);
  const selectedJob = jobs.find((job) => job.requestId === selectedJobId);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Job Requests</h2>

      {/* Filter Buttons */}
      <div className="mb-4 flex gap-3">
        <Button
          onClick={() => setSelectedStatus('Pending')}
          className={clsx(
            selectedStatus === 'Pending'
              ? 'bg-blue-500 text-white'
              : 'bg-white hover:bg-gray-100 text-gray-700 border',
            'w-50'
          )}
        >
          Pending
        </Button>
        <Button
          onClick={() => setSelectedStatus('Approved')}
          className={clsx(
            selectedStatus === 'Approved'
              ? 'bg-green-600 text-white hover:bg-green-500'
              : 'bg-white hover:bg-gray-100 text-gray-700 border',
            'w-50'
          )}
        >
          Approved
        </Button>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length === 0 ? (
          <p className="text-gray-500">No jobs found with status "{selectedStatus}".</p>
        ) : (
          filteredJobs.map((job) => (
            <JobCard
              key={job.requestId}
              job={job}
              onClick={() => setSelectedJobId(job.requestId)}
              onDelete={() => handleDelete(job.requestId)}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => setCurrentPage(index + 1)}
            className={clsx(
              'px-3 py-1 rounded border',
              currentPage === index + 1
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            )}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => prev + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Full Details */}
      {selectedJob && <JobDetails job={selectedJob} />}
    </div>
  );
};

export default JobUpdatePage;