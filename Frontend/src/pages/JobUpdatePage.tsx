import React, { useState } from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
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

const fetchJobs = async (page: number): Promise<ApiResponse> => {
  const res = await axios.get<ApiResponse>(
    `http://localhost:5095/api/JobRequest?page=${page}&pageSize=2`
  );
  return res.data;
};

const deleteJob = async (jobId: number) => {
  await axios.delete(`http://localhost:5095/api/JobRequest/${jobId}`);
};

const JobUpdatePage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('Pending');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const queryClient = useQueryClient();

  // Typed query with UseQueryResult<ApiResponse, Error>
const { data, isLoading, isError } = useQuery<ApiResponse, Error>({
  queryKey: ['jobs', currentPage],
  queryFn: () => fetchJobs(currentPage),
});

  const mutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs', currentPage] as const });
      setSelectedJobId(null);
    },
  });

  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job request?'
    );
    if (!confirmed) return;

    mutation.mutate(jobId);
  };

  const filteredJobs = data?.data.filter((job) => job.status === selectedStatus) || [];
  const selectedJob = data?.data.find((job) => job.requestId === selectedJobId) || null;

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
      {isLoading ? (
        <p>Loading jobs...</p>
      ) : isError ? (
        <p className="text-red-500">Error loading jobs</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-500">
              No jobs found with status "{selectedStatus}".
            </p>
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

      {/* Full Job Details */}
      {selectedJob && <JobDetails job={selectedJob} />}
    </div>
  );
};

export default JobUpdatePage;
