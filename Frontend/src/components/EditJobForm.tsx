import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import InputField from './InputField';
import TextAreaField from './TextAreaField';
import Button from './Button';

import type { Job } from '../types/details';

import type { jobFormData } from '../schema/jobSchema';
import { jobSchema } from '../schema/jobSchema';

interface EditJobFormProps {
  job: Job;
  onSuccess: (updatedJob: Job) => void;
  onCancel: () => void;
}

const EditJobForm: React.FC<EditJobFormProps> = ({ job, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<jobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: job.title,
      description: job.description,
      positionCount: job.positionCount,
      minQualification: job.minQualification,
      minExperience: job.minExperience,
      minSalary: Number(job.minSalary),
      maxSalary: Number(job.maxSalary),
      departmentName: job.departmentName,
      requesterName: job.requestedByName,
    },
  });

  // ✅ Mutation for PUT request
  const mutation = useMutation({
    mutationFn: (data: jobFormData) =>
      axios.put<Job>(`http://localhost:5095/api/JobRequest/${job.requestId}`, {
        ...job,
        ...data,
        minSalary: data.minSalary.toString(),
        maxSalary: data.maxSalary.toString(),
      }),
    onSuccess: (res) => {
      onSuccess(res.data);
      alert('Job updated successfully.');
    },
    onError: (error:any) => {
      const backendMessage = error?.response?.data || 'Failed to Edit job request';
      if(typeof backendMessage=='string'){
        alert(backendMessage);
      }else{
        alert(backendMessage.errors.MaxSalary[0]);
      }
    },
  });

  const onSubmit = (data: jobFormData) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 border rounded bg-gray-50 space-y-4">
      <h3 className="text-xl font-semibold mb-4">Edit Job</h3>

      <InputField label="Title" {...register('title')} error={errors.title} />
      <TextAreaField label="Description" {...register('description')} error={errors.description} />
      <InputField type="number" label="Position Count" {...register('positionCount', { valueAsNumber: true })} error={errors.positionCount} />
      <InputField label="Minimum Qualification" {...register('minQualification')} error={errors.minQualification} />
      <InputField type="number" label="Minimum Experience (years)" {...register('minExperience', { valueAsNumber: true })} error={errors.minExperience} />
      <InputField type="number" label="Minimum Salary" {...register('minSalary', { valueAsNumber: true })} error={errors.minSalary} />
      <InputField type="number" label="Maximum Salary" {...register('maxSalary', { valueAsNumber: true })} error={errors.maxSalary} />
      <InputField label="Department Name" {...register('departmentName')} error={errors.departmentName} />
      <InputField label="Requester Name" {...register('requesterName')} error={errors.requesterName} />

      <div className="flex gap-4 mt-6">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
        <Button type="button" onClick={onCancel} className="bg-gray-200 hover:bg-gray-300 text-black">
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default EditJobForm;
