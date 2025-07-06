import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

import InputField from '../components/InputField';
import TextAreaField from '../components/TextAreaField';
import Button from '../components/Button';

import type {jobFormData} from '../schema/jobSchema';
import {jobSchema} from '../schema/jobSchema';

const JobRequestPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<jobFormData>({
    resolver: zodResolver(jobSchema),
  });

  // ✅ Mutation hook for form submission
  const mutation = useMutation({
    mutationFn: (data: jobFormData) => {
      const payload = {
        ...data,
        minSalary: data.minSalary.toString(),
        maxSalary: data.maxSalary.toString(),
        requestDate: new Date().toISOString(),
      };
      const res= axios.post('http://localhost:5095/api/JobRequest', payload);
      console.log("Details:"+res);
      return res
    },
    onSuccess: () => {
      alert('Job request submitted successfully!');
      reset(); // Reset the form after success
    },
    onError: (error: any) => {
      const backendMessage = error?.response?.data || 'Failed to submit job request';
      if(typeof backendMessage=='string'){
        console.log(backendMessage);
        alert(backendMessage);
      }else{
        alert(backendMessage.errors.MaxSalary[0]||backendMessage);
      }
    }
  });

  const onSubmit = (data: jobFormData) => {
    mutation.mutate(data); // Trigger the mutation
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Job Request Form</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField label="Title" type="text" {...register('title')} error={errors.title} />
        <TextAreaField label="Description" rows={4} {...register('description')} error={errors.description} />
        <InputField label="Position Count" type="number" {...register('positionCount', { valueAsNumber: true })} error={errors.positionCount} />
        <InputField label="Minimum Qualification" type="text" {...register('minQualification')} error={errors.minQualification} />
        <InputField label="Minimum Experience (Years)" type="number" {...register('minExperience', { valueAsNumber: true })} error={errors.minExperience} />
        <InputField label="Minimum Salary" type="number" {...register('minSalary', { valueAsNumber: true })} error={errors.minSalary} />
        <InputField label="Maximum Salary" type="number" {...register('maxSalary', { valueAsNumber: true })} error={errors.maxSalary} />
        <InputField label="Requester Name" type="text" {...register('requesterName')} error={errors.requesterName} />
        <InputField label="Department Name" type="text" {...register('departmentName')} error={errors.departmentName} />

        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : 'Submit Job Request'}
        </Button>
      </form>
    </div>
  );
};

export default JobRequestPage;
