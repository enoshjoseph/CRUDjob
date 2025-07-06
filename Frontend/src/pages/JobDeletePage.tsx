import React, { useState } from 'react';
import clsx from 'clsx';

import JobCard from '../components/JobCard';
import JobDetails from '../components/JobDetails';
import Button from '../components/Button';

import type { JobStatus } from '../types/details';
import type { ApiResponse } from '../types/ApiResponse';

import { useGetQuery } from '../features/useGetQuery';
import { useDeleteMutation } from '../features/useDeleteMutation';

const pageSize=2;

const JobUpdatePage: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('Pending');
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // UseQuery with caching optimization
  const { data, isLoading, isError } = useGetQuery<ApiResponse>(
    ['jobs',currentPage],
    currentPage,
    pageSize,
    {staleTime: 1000 * 120,
    refetchOnWindowFocus: false}
  );

  // Delete Mutation
  const mutation = useDeleteMutation({
    entity: 'JobRequest',
    key: ['jobs', currentPage],
    onSuccessFn: ()=>setSelectedJobId(null),
});

  // Handle Delete
  const handleDelete = async (jobId: number) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this job request?'
    );
    if (!confirmed) return;
    mutation.mutate(jobId);
  };

  // Filter jobs by selected status
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

      {/* Full Details */}
      {selectedJob && <JobDetails job={selectedJob} />}
    </div>
  );
};

export default JobUpdatePage;
