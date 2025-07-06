import {z} from 'zod';

export const jobSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  positionCount: z.number().min(1, 'At least 1 position is required'),
  minQualification: z.string().min(1, 'Minimum qualification is required'),
  minExperience: z.number().min(0, 'Experience cannot be negative'),
  minSalary: z.number().min(0, 'Minimum salary is required'),
  maxSalary: z.number().min(0, 'Maximum salary is required'),
  departmentName: z.string().min(1, 'Department is required'),
  requesterName: z.string().min(1, 'Requester name is required'),
});

export type jobFormData = z.infer<typeof jobSchema>;