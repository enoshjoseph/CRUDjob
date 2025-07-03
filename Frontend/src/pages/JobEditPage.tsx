import React, { useState } from 'react';
import {
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';

import type { Job, JobStatus } from '../types/details';
import JobCard from '../components/JobCard';
import EditJobForm from '../components/EditJobForm';
import Button from '../components/Button';

interface ApiResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: Job[];
}

const fetchJobs = async (page: number): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(
    `http://localhost:5095/api/JobRequest?page=${page}&pageSize=2`
  );
  return res.data;
};

const JobEditPage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('Pending');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
    queryKey: ['jobs', currentPage],
    queryFn: () => fetchJobs(currentPage)
  });

  const handleUpdateSuccess = (updatedJob: Job) => {
    queryClient.setQueryData<ApiResponse>(['jobs', currentPage], (oldData) => {
      if (!oldData) return oldData;
      const updatedJobs = oldData.data.map((job) =>
        job.requestId === updatedJob.requestId ? updatedJob : job
      );
      return { ...oldData, data: updatedJobs };
    });
    setSelectedJobId(null);
  };

  const filteredJobs = data?.data.filter((job) => job.status === selectedStatus) || [];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Job Requests</h2>

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

      {/* Job Cards or Edit Form */}
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : isError ? (
        <p className="text-red-500">Error fetching jobs.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-500">No jobs found with status "{selectedStatus}".</p>
          ) : (
            filteredJobs.map((job) =>
              job.requestId === selectedJobId ? (
                <div key={job.requestId} className="col-span-1 md:col-span-2">
                  <EditJobForm
                    job={job}
                    onSuccess={handleUpdateSuccess}
                    onCancel={() => setSelectedJobId(null)}
                  />
                </div>
              ) : (
                <JobCard
                  key={job.requestId}
                  job={job}
                  onClick={() => setSelectedJobId(job.requestId)}
                  showEditOnly
                />
              )
            )
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && data && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: data.totalPages }, (_, index) => (
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
            disabled={currentPage === data.totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JobEditPage;
