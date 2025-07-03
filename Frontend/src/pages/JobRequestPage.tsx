import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

// ✅ Updated schema with new fields
const jobRequestSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  positionCount: z.number().min(1, 'At least 1 position'),
  minQualification: z.string().min(1, 'Minimum qualification is required'),
  minExperience: z.number().min(0, 'Experience cannot be negative'),
  minSalary: z.number().min(0, 'Minimum salary cannot be negative'),
  maxSalary: z.number().min(0, 'Maximum salary cannot be negative'),
  requesterName: z.string().min(1, 'Requester name is required'),       // ✅ NEW
  departmentName: z.string().min(1, 'Department name is required'),     // ✅ NEW
});

type JobRequestFormData = z.infer<typeof jobRequestSchema>;

const JobRequestPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobRequestFormData>({
    resolver: zodResolver(jobRequestSchema),
  });

  const onSubmit = async (data: JobRequestFormData) => {
    const requestData = {
      ...data,
      minSalary: data.minSalary.toString(),
      maxSalary: data.maxSalary.toString()
    };

    try {
      console.log('Request Payload:', requestData);
      const res = await axios.post('http://localhost:5095/api/JobRequest', requestData);
      console.log(res);
      alert('Job request submitted successfully!');
    } catch (error) {
      console.error(error);
      alert('Failed to submit job request');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Job Request Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title</label>
          <input
            type="text"
            {...register('title')}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Description</label>
          <textarea
            {...register('description')}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
        </div>

        {/* Position Count */}
        <div>
          <label className="block text-sm font-medium">Position Count</label>
          <input
            type="number"
            {...register('positionCount', { valueAsNumber: true })}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.positionCount && <p className="text-red-500 text-sm">{errors.positionCount.message}</p>}
        </div>

        {/* Minimum Qualification */}
        <div>
          <label className="block text-sm font-medium">Minimum Qualification</label>
          <input
            type="text"
            {...register('minQualification')}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.minQualification && <p className="text-red-500 text-sm">{errors.minQualification.message}</p>}
        </div>

        {/* Minimum Experience */}
        <div>
          <label className="block text-sm font-medium">Minimum Experience (Years)</label>
          <input
            type="number"
            {...register('minExperience', { valueAsNumber: true })}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.minExperience && <p className="text-red-500 text-sm">{errors.minExperience.message}</p>}
        </div>

        {/* Minimum Salary */}
        <div>
          <label className="block text-sm font-medium">Minimum Salary</label>
          <input
            type="number"
            {...register('minSalary', { valueAsNumber: true })}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.minSalary && <p className="text-red-500 text-sm">{errors.minSalary.message}</p>}
        </div>

        {/* Maximum Salary */}
        <div>
          <label className="block text-sm font-medium">Maximum Salary</label>
          <input
            type="number"
            {...register('maxSalary', { valueAsNumber: true })}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.maxSalary && <p className="text-red-500 text-sm">{errors.maxSalary.message}</p>}
        </div>

        {/* ✅ Requester Name */}
        <div>
          <label className="block text-sm font-medium">Requester Name</label>
          <input
            type="text"
            {...register('requesterName')}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.requesterName && <p className="text-red-500 text-sm">{errors.requesterName.message}</p>}
        </div>

        {/* ✅ Department Name */}
        <div>
          <label className="block text-sm font-medium">Department Name</label>
          <input
            type="text"
            {...register('departmentName')}
            className="mt-1 w-full border rounded px-3 py-2"
          />
          {errors.departmentName && <p className="text-red-500 text-sm">{errors.departmentName.message}</p>}
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit Job Request
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobRequestPage;