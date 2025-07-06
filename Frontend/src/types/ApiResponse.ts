import type {Job} from './details'

export interface ApiResponse {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  data: Job[];
}