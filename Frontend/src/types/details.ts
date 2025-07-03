export type JobStatus = 'Approved' | 'Pending';

export interface Job {
  requestId: number;
  title: string;
  departmentName: string;
  requestedByName: string;
  status: 'Pending' | 'Approved';
  description: string;
  positionCount: number;
  minQualification: string;
  minExperience: number;
  salaryRange: string;
  requestDate: string;
}
